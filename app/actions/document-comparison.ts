import prisma from "@/prisma/client";
import type { Prisma } from "@prisma/client";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

type ComparisonData = Record<string, string>;

export async function getDocumentCountForMonth(
  whereClause: Prisma.DocumentWhereInput,
  dateField: keyof Prisma.DocumentWhereInput,
  date: Date,
  workspaceId: string
): Promise<number> {
  const firstDayOfMonth = startOfMonth(date);
  const lastDayOfMonth = endOfMonth(date);

  return prisma.document.count({
    where: {
      ...whereClause,
      workspaceId,
      [dateField]: {
        gte: firstDayOfMonth,
        lte: lastDayOfMonth,
      },
    },
  });
}

export function calculatePercentageChange(
  current: number,
  previous: number
): string {
  if (previous === 0) {
    return "0%";
  }
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
}

export async function getComparisonData(
  userId: string,
  workspaceId: string
): Promise<ComparisonData> {
  const currentMonth = new Date();
  const previousMonth = subMonths(currentMonth, 1);

  const comparisonData: ComparisonData = {};

  const statuses = ["created", "ongoing", "completed", "shared"];
  for (const status of statuses) {
    const whereClause: Prisma.DocumentWhereInput = {
      userId,
      ...(status === "shared" ? { shared: true } : { status }),
    };
    const dateField = status === "created" ? "createdAt" : "updatedAt";

    const currentMonthCount = await getDocumentCountForMonth(
      whereClause,
      dateField,
      currentMonth,
      workspaceId
    );
    const previousMonthCount = await getDocumentCountForMonth(
      whereClause,
      dateField,
      previousMonth,
      workspaceId
    );

    comparisonData[status] = calculatePercentageChange(
      currentMonthCount,
      previousMonthCount
    );
  }

  return comparisonData;
}
