"use server";

import prisma from "@/prisma/client";
import type { Document } from "@prisma/client";
import { redis as redisClient } from "@/redis-client";
import { fetchingEmbeddings } from "@/app/actions/ai";

interface KeywordEmbedding {
  keyword: string;
  embedding: number[];
}

export const fetchDocumentsById = async (
  id: string,
  userId: string,
  workspaceId: string
) => {
  const document = await prisma.document.findFirst({
    where: {
      id,
      userId,
      workspaceId,
    },
  });
  if (!document) {
    throw new Error("Document not found or access denied");
  }
  return document;
};

export const fetchDocuments = async (
  userId: string,
  workspaceId: string
): Promise<Document[]> => {
  try {
    const documents = await prisma.document.findMany({
      where: {
        userId,
        workspaceId,
      },
    });
    return documents;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};

export const fetchOngoingDocuments = async (
  userId: string,
  workspaceId: string
): Promise<Document[]> => {
  const ongoingDocuments = await prisma.document.findMany({
    where: { status: "ongoing", userId, workspaceId },
  });
  return ongoingDocuments;
};

export const fetchCompletedDocuments = async (
  userId: string,
  workspaceId: string
): Promise<Document[]> => {
  const completedDocuments = await prisma.document.findMany({
    where: { status: "completed", userId, workspaceId },
  });
  return completedDocuments;
};

export const fetchSharedDocuments = async (
  userId: string,
  workspaceId: string
): Promise<Document[]> => {
  const sharedDocuments = await prisma.document.findMany({
    where: { shared: true, userId, workspaceId },
  });
  return sharedDocuments;
};

export const fetchFavoriteDocuments = async (
  userId: string,
  workspaceId: string
): Promise<Document[]> => {
  const favoriteDocuments = await prisma.document.findMany({
    where: { favorite: true, userId, workspaceId },
  });
  return favoriteDocuments;
};

export const fetchDocumentSharedStatus = async (
  id: string,
  userId: string,
  workspaceId: string
): Promise<boolean> => {
  const document = await prisma.document.findUnique({
    where: {
      id,
      userId,
      workspaceId,
    },
    select: {
      shared: true,
    },
  });

  if (!document) {
    throw new Error("Document not found");
  }

  return document.shared;
};

export const handleDocumentCreate = async (
  title: string,
  content: string,
  userId: string,
  workspaceId: string,
  lastAccessed: Date
) => {
  const documentCreate = await prisma.document.create({
    data: {
      title,
      content,
      userId,
      workspaceId,
      lastAccessed,
    },
  });
  return documentCreate;
};

export const handleDocumentDelete = async (id: string, workspaceId: string) => {
  const documentDelete = await prisma.document.delete({
    where: {
      id,
      workspaceId,
    },
  });
  return documentDelete;
};

export const handleDocumentSave = async (
  id: string,
  workspaceId: string,
  title: string,
  content: string,
  contextEnabled: boolean
) => {
  // console.log(
  //   `Saving document with ID: ${id} and workspace ID: ${workspaceId}`
  // );

  // Update the document with the new title and content
  const document = await prisma.document.findUnique({
    where: { id: id, workspaceId: workspaceId },
  });

  if (!document) {
    console.error(
      `Document with ID: ${id} and workspace ID: ${workspaceId} not found.`
    );
    throw new Error("Document not found");
  }

  if (contextEnabled) {
    // Strip HTML tags from the content
    const contentText = content.replace(/<[^>]*>?/gm, "");

    // Check if the response is in the cache
    const cacheKey = `openai:${contentText}`;
    const cachedResponse = await redisClient.get(cacheKey);

    let keywordEmbeddings;
    if (cachedResponse && typeof cachedResponse === "string") {
      // Use the cached response
      keywordEmbeddings = JSON.parse(cachedResponse);
    } else if (contextEnabled) {
      const data = await fetchingEmbeddings(contentText);
      keywordEmbeddings = data.keywords;

      // Save the response in the cache
      await redisClient.set(cacheKey, JSON.stringify(keywordEmbeddings));
    }

    // Fetch existing keywords for the document
    const existingKeywords = await prisma.keyword.findMany({
      where: { documentId: id },
    });

    // Get the words of the existing keywords
    const existingKeywordWords = existingKeywords.map(
      (keyword) => keyword.word
    );

    // Get the words of the new keywords
    if (Array.isArray(keywordEmbeddings)) {
      const newKeywordWords = keywordEmbeddings.map(
        (keywordEmbedding: KeywordEmbedding) => keywordEmbedding.keyword
      );

      // Find new keywords that are not in the existing keywords
      const keywordsToAdd = keywordEmbeddings.filter(
        (keywordEmbedding: KeywordEmbedding) =>
          !existingKeywordWords.includes(keywordEmbedding.keyword)
      );

      // Find existing keywords that are not in the new keywords
      const keywordsToDelete = existingKeywords.filter(
        (keyword) => !newKeywordWords.includes(keyword.word)
      );

      // Add new keywords to the database
      await prisma.keyword.createMany({
        data: keywordsToAdd.map((keywordEmbedding: KeywordEmbedding) => ({
          documentId: document.id,
          word: keywordEmbedding.keyword,
          embedding: keywordEmbedding.embedding,
        })),
      });

      // Delete old keywords from the database
      await prisma.keyword.deleteMany({
        where: { id: { in: keywordsToDelete.map((keyword) => keyword.id) } },
      });
    }
  }

  // Update the document with the new title and content, and possibly keywords
  const documentSave = await prisma.document.update({
    where: { id },
    data: {
      title,
      content,
    },
  });

  return documentSave;
};

export const handleDocumentCopy = async (
  documentId: string,
  newTitle: string,
  workspaceId: string,
  lastAccessed: Date
) => {
  const documentToCopy = await prisma.document.findUnique({
    where: { id: documentId, workspaceId: workspaceId },
  });
  if (!documentToCopy) throw new Error("Document not found");

  const { id, ...copyData } = documentToCopy;

  const documentCopied = await prisma.document.create({
    data: {
      ...copyData,
      title: newTitle,
      lastAccessed,
      workspaceId,
    },
  });

  return documentCopied;
};

export const handleDocumentFavoriteToggle = async (
  documentId: string,
  workspaceId: string
) => {
  const document = await prisma.document.findUnique({
    where: { id: documentId, workspaceId },
  });

  if (!document) {
    throw new Error("Document not found");
  }

  const documentUpdated = await prisma.document.update({
    where: { id: documentId },
    data: { favorite: !document.favorite },
  });

  return documentUpdated;
};

export const handleDocumentBulkDelete = async (
  ids: string[],
  workspaceId: string
) => {
  const documentBulkDelete = await prisma.document.deleteMany({
    where: {
      id: {
        in: ids,
      },
      workspaceId,
    },
  });
  return documentBulkDelete;
};

export const handleDocumentStatusChange = async (
  id: string,
  status: string,
  workspaceId: string
) => {
  const documentStatusChange = await prisma.document.update({
    where: {
      id,
      workspaceId,
    },
    data: {
      status,
    },
  });
  return documentStatusChange;
};

export const handleDocumentPriorityChange = async (
  id: string,
  priority: string,
  workspaceId: string
) => {
  const documentPriorityChange = await prisma.document.update({
    where: {
      id,
      workspaceId,
    },
    data: {
      priority,
    },
  });
  return documentPriorityChange;
};

export const handleDocumentSharedChange = async (
  id: string,
  shared: boolean,
  workspaceId: string
) => {
  const documentSharedChange = await prisma.document.update({
    where: {
      id,
      workspaceId,
    },
    data: {
      shared,
    },
  });
  return documentSharedChange;
};

// Testing

export const handleDocumentSharedChangeTest = async (
  id: string,
  shared: boolean,
  workspaceId: string
) => {
  const documentSharedChange = await prisma.document.update({
    where: {
      id,
      workspaceId,
    },
    data: {
      shared,
    },
  });
  return documentSharedChange;
};

export const fetchSharedDocument = async (
  documentId: string
): Promise<Document | null> => {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });
  return document;
};
