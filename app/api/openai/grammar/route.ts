import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import nlp from "compromise";
import OpenAI from "openai";
import { redis as redisClient, ratelimit } from "@/redis-client";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// export const runtime = "edge";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type Correction = {
  original: string;
  corrected: string;
  reason: string;
  offset: number;
  length: number;
};

function normalizeText(text: string) {
  text = text.replace(/(?<=\w)[\u2018\u2019](?=\w)/g, "’");
  text = text.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
  text = text.replace(/[\u2013\u2014]/g, "-");
  text = text.replace(/\u2026/g, "...");

  return text;
}

// Split text into sentences using the 'compromise' library
function splitIntoSentences(text: string) {
  const doc = nlp(text);
  const sentences = doc.sentences().out("array");
  return sentences;
}

function getIndicesOf(
  searchStr: string,
  content: string,
  caseSensitive = false
) {
  const searchStrLen = searchStr.length;
  if (searchStrLen == 0) {
    return [];
  }

  let startIndex = 0,
    index;
  const indices = [];
  if (!caseSensitive) {
    content = content.toLowerCase();
    searchStr = searchStr.toLowerCase();
  }

  while ((index = content.indexOf(searchStr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + searchStrLen;
  }

  return indices;
}

function generatePrompt(message: string) {
  return `Pretend that you are an English Grammar teacher. 
    Correct the grammatical mistakes in this text by replying in JSON format. 
    The JSON response should contain a corrections array and each correction should contain the original word that needs to be corrected, the recommended correction for the word, and the reason for the correction.
    The output should be JSON. Omit entries for words where no correction is needed.

    Example of error correction entry:

    {
      "original": "He go to school everyday.",
      "corrected": "He goes to school every day.",
      "reason": "Corrected the subject-verb agreement and separated 'everyday' to 'every day' for proper adverbial usage."
    },
    
    Here is my text: ${message}.`;
}

function safeJSONParse<T>(str: string): T | null {
  try {
    return JSON.parse(str);
  } catch (e) {
    if (e instanceof SyntaxError) {
      const match = e.message.match(/position (\d+)/);
      const position = match ? parseInt(match[1], 10) : -1;
      console.error(
        `Failed to parse JSON at position ${position}:`,
        position >= 0 ? str.substring(position - 50, position + 50) : str
      );
    } else {
      console.error("Failed to parse JSON:", e);
    }
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // console.log("User session:", session);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { user } = session;
    const subscriptionPlan = await getUserSubscriptionPlan(user.id);
    // console.log(`Subscription plan for user ${user.id}:`, subscriptionPlan);

    // Rate limiting setup for non-Pro users
    // console.log(
    //   `Checking rate limit for user ${user.id}. Is Pro: ${subscriptionPlan?.isPro}`
    // );
    if (!subscriptionPlan?.isPro) {
      const ip = req.ip;

      const { success, limit, reset, remaining } = await ratelimit.limit(
        `grammar_ratelimit_${ip}`
      );
      // console.log(`Rate limit check for user ${user.id}:`, {
      //   success,
      //   limit,
      //   reset,
      //   remaining,
      // });

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

    // Normalize and strip HTML tags from the text
    const normalizedText = normalizeText(text.replace(/<[^>]*>?/gm, ""));

    // Split the text into sentences
    const sentences = splitIntoSentences(normalizedText);

    // Initialize an array to hold all corrections
    const allCorrections: Correction[] = [];

    for (const sentence of sentences) {
      // Generate a unique cache key based on the sentence
      const cacheKey = `openai:grammar:${sentence}`;

      // Check if the response is in the cache
      const cachedResponse = await redisClient.get(cacheKey);

      if (cachedResponse && typeof cachedResponse === "string") {
        const parsedResponse = JSON.parse(cachedResponse) as {
          corrections: Correction[];
        };
        if (
          parsedResponse.corrections.every(
            (correction: Correction) => correction.corrected !== undefined
          )
        ) {
          // If a cached response is found, add it to allCorrections and continue to the next sentence
          allCorrections.push(...parsedResponse.corrections);
          continue;
        }
      }

      const prompt = generatePrompt(sentence);

      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: prompt,
            },
          ],
          temperature: 0.4,
          max_tokens: 400,
          top_p: 1,
        });

        const response_content = (
          response.choices[0]?.message?.content ?? "[]"
        ).toString();

        const responseCorrections = safeJSONParse<{
          corrections: Correction[];
        }>(response_content);

        if (!responseCorrections) {
          console.error(
            "Failed to parse response from OpenAI:",
            response_content
          );
          return new NextResponse(
            JSON.stringify({ error: "Failed to parse OpenAI response" }),
            {
              status: 500,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }

        const sentenceCorrections: Correction[] = [];

        for (const correction of responseCorrections?.corrections) {
          // Find all matching words with offset position
          const offsets = getIndicesOf(correction.original, sentence, true);

          if (offsets.length) {
            // Create a new correction object with offset position
            for (const offset of offsets) {
              const newCorrectionObject: Correction = {
                original: correction.original,
                corrected: correction.corrected,
                reason: correction.reason || "Reason not provided by AI",
                offset: offset + 1,
                length: correction.original.length,
              };

              sentenceCorrections.push(newCorrectionObject);
            }
          }
        }

        // After receiving the response from the OpenAI API, store it in the cache
        await redisClient.set(
          cacheKey,
          JSON.stringify({ corrections: sentenceCorrections }),
          { ex: 3600 }
        );

        // Add the sentence corrections to allCorrections
        allCorrections.push(...sentenceCorrections);
      } catch (error) {
        console.error("Error during OpenAI API call:", error);

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

    // After all sentences have been processed, return allCorrections in the response
    return new NextResponse(JSON.stringify({ corrections: allCorrections }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Log the error or handle it as needed
    console.error("An error occurred:", error);
    return new NextResponse(
      JSON.stringify({ error: "An unexpected error occurred" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
