"use server";

import prisma from "@/prisma/client";
import { groupBy } from "lodash";
import { format } from "date-fns";

interface DocumentData {
  documents: { title: string; wordCount: number }[];
  wordCount: number;
}

type GroupedByMonth = Record<string, DocumentData>;

const countWords = (text: string): number => {
  const plainText = text.replace(/<[^>]*>/g, "").trim();
  return plainText.split(/\s+/).filter(Boolean).length;
};

export const fetchPerformance = async (userId: string, workspaceId: string) => {
  const documents = await prisma.document.findMany({
    where: {
      userId,
      workspaceId,
    },
    select: {
      title: true,
      content: true,
      createdAt: true,
    },
  });

  const groupedByMonth = documents.reduce<GroupedByMonth>((acc, doc) => {
    const month = format(doc.createdAt, "MMM yyyy");
    if (!acc[month]) {
      acc[month] = { documents: [], wordCount: 0 };
    }
    const wordCount = countWords(doc.content);
    acc[month].documents.push({ title: doc.title, wordCount });
    acc[month].wordCount += wordCount;
    return acc;
  }, {});

  return Object.entries(groupedByMonth).map(([month, data]) => ({
    name: month,
    ...data,
  }));
};

export const fetchActivity = async (
  userId: string,
  workspaceId: string
): Promise<{ date: string; count: number }[]> => {
  const documents = await prisma.document.findMany({
    where: {
      userId,
      workspaceId,
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const groupedByMonth = groupBy(documents, (doc) =>
    format(doc.createdAt, "MMM yyyy")
  );

  return Object.entries(groupedByMonth)
    .map(([month, docs]) => ({
      date: month,
      count: docs.length,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
