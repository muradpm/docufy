import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Client } from "postmark";
import { env } from "@/env.mjs";

interface FeedbackRequestBody {
  feedback: string;
  email: string;
}

export async function POST(req: NextRequest) {
  const postmarkClient = new Client(env.POSTMARK_API_TOKEN);
  const { feedback, email }: FeedbackRequestBody = await req.json();

  try {
    await postmarkClient.sendEmail({
      From: "oncall@docufy.ai",
      To: "murad@docufy.ai",
      Subject: "Feedback submission",
      TextBody: `Feedback from ${email}: ${feedback}`,
    });

    return new NextResponse(JSON.stringify({ message: "Feedback sent successfully" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("Failed to send feedback", error);
    return new NextResponse(JSON.stringify({ message: "Failed to send feedback" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
