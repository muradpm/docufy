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
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { user } = session;
    const subscriptionPlan = await getUserSubscriptionPlan(user.id);

    // Rate limiting setup for non-Pro users
    if (!subscriptionPlan?.isPro) {
      const ip = req.ip;

      const { success, limit, reset, remaining } = await ratelimit.limit(
        `embed_ratelimit_${ip}`
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

    // Strip HTML tags from the text
    const textContent = text.replace(/<[^>]*>?/gm, "");

    // Check if the response is in the cache
    const cacheKey = `openai:${textContent}`;
    const cachedResponse = await redisClient.get(cacheKey);

    if (cachedResponse && typeof cachedResponse === "string") {
      return new NextResponse(cachedResponse, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // If the response is not in the cache, call the OpenAI API

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant. Please identify individual key terms from the text below that would be most useful for matching this document with other similar documents.
            Focus on unique and significant terms rather than phrases. List each term separately, separated by commas.
            Here's the text: ${textContent}`,
        },
        {
          role: "user",
          content: textContent,
        },
      ],
      temperature: 0.7,
      max_tokens: 64,
      top_p: 1,
    });

    if (!response.choices?.[0]?.message?.content) {
      throw new Error("Failed to extract keywords");
    }

    const keywords = response.choices[0].message.content
      .split(",")
      .map((keyword) => keyword.trim());

    // Create embeddings for the keywords
    const keywordEmbeddings = await Promise.all(
      keywords.map(async (keyword) => {
        const embedResponse = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: keyword.toLowerCase(),
          encoding_format: "float",
        });

        return {
          keyword: keyword.toLowerCase(),
          embedding: embedResponse.data[0].embedding,
        };
      })
    );

    // Store the response in the cache
    await redisClient.set(
      cacheKey,
      JSON.stringify({ keywords: keywordEmbeddings })
    );

    return new NextResponse(JSON.stringify({ keywords: keywordEmbeddings }), {
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
