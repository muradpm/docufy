"use server";

import type { Document } from "@prisma/client";
import prisma from "@/prisma/client";

export const searchDocuments = async (
  query: string,
  userId: string,
  workspaceId: string
): Promise<Document[]> => {
  const searchResults = await prisma.document.findMany({
    where: {
      userId,
      workspaceId,
      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
  });
  return searchResults;
};
