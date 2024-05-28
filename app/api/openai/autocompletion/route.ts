import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import OpenAI from "openai";
import { redis as redisClient, ratelimit } from "@/redis-client";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;
    const subscriptionPlan = await getUserSubscriptionPlan(user.id);

    // Rate limiting setup for non-Pro users
    if (!subscriptionPlan?.isPro) {
      const ip = req.ip;

      const { success, limit, reset, remaining } = await ratelimit.limit(
        `autocompletion_ratelimit_${ip}`
      );

      if (!success) {
        return new NextResponse(
          JSON.stringify({
            error: "You have reached your request limit for the day.",
            limit,
            reset,
            remaining,
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": new Date(reset * 1000).toISOString(),
            },
          }
        );
      }
    }

    const body = await req.json();
    const { text } = body;

    if (typeof text !== "string") {
      return new NextResponse(
        JSON.stringify({ error: "Text must be a string" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Strip HTML tags from the text
    const textContent = text.replace(/<[^>]*>?/gm, "");

    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an AI writing assistant that continues existing text based on context from prior text. " +
            "Give more weight/priority to the later characters than the beginning ones. " +
            "Limit your response to no more than 200 characters, but make sure to construct complete sentences.",
        },
        {
          role: "user",
          content: textContent,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
      top_p: 1,
      stream: true,
    });

    let content = "";
    for await (const part of stream) {
      content += part.choices[0]?.delta?.content ?? "";
    }

    return new NextResponse(JSON.stringify({ correctedText: content }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: error.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return new NextResponse(
        JSON.stringify({ error: "OpenAI request failed" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }
}
