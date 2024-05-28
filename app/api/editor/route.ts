import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/prisma/client";

// Cosine similarity function
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, a_i, i) => sum + a_i * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, a_i) => sum + a_i * a_i, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, b_i) => sum + b_i * b_i, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

export async function POST(request: NextRequest) {
  const { sourceDocumentId } = await request.json();

  // Fetch all keywords from the database
  const keywords = await prisma.keyword.findMany({
    select: {
      id: true,
      documentId: true,
      word: true,
      embedding: true,
      document: {
        select: {
          title: true,
        },
      },
    },
  });

  // Get the keywords of the source document
  const sourceKeywords = keywords.filter(
    (keyword) => keyword.documentId === sourceDocumentId
  );

  const similarities = keywords
    .filter((keyword) => keyword.documentId !== sourceDocumentId) // Exclude the source document
    .map((targetKeyword) => {
      const similarKeywords = sourceKeywords
        .filter((sourceKeyword) => sourceKeyword.word === targetKeyword.word)
        .map((keyword) => keyword.word);

      return {
        sourceDocumentId: sourceDocumentId,
        documentId: targetKeyword.documentId,
        documentTitle: targetKeyword.document.title,
        similarity:
          sourceKeywords.length > 0 && targetKeyword
            ? cosineSimilarity(
                sourceKeywords[0].embedding as number[],
                targetKeyword.embedding as number[]
              )
            : 0,
        similarKeywords: similarKeywords,
      };
    });

  return NextResponse.json({ similarities });
}
