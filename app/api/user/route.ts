import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/prisma/client";

interface UserUpdateRequestBody {
  userId: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export async function PATCH(req: NextRequest) {
  if (req.method !== "PATCH") {
    return new NextResponse(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const requestBody: UserUpdateRequestBody = await req.json();
    const { userId, name, email, avatarUrl } = requestBody;

    // Ensure the request contains the userId
    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: "User ID is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        image: avatarUrl,
      },
    });

    return new NextResponse(JSON.stringify(updatedUser), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to update user profile:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to update profile" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
