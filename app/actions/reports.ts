"use server";

import prisma from "@/prisma/client";
import type { Report, User } from "@prisma/client";

export const createReport = async (
  userId: string,
  workspaceId: string,
  filename: string,
  reportUrl: string
): Promise<{ success: boolean; message?: string; error?: string }> => {
  let report: Report | null = null;

  try {
    report = await prisma.report.create({
      data: {
        userId,
        workspaceId,
        title: filename,
        status: "Success",
        createdAt: new Date(),
        downloadUrl: reportUrl,
      },
    });

    return {
      success: true,
      message: "Report created and processed successfully",
    };
  } catch (error) {
    console.error("Error processing report:", error);

    if (report?.id) {
      await prisma.report.update({
        where: { id: report.id },
        data: { status: "Failed" },
      });
    }

    return { success: false, error: "Failed to process report" };
  }
};

export const fetchReports = async (
  userId: string,
  workspaceId: string
): Promise<{
  success: boolean;
  reports?: (Report & { user: User })[];
  error?: string;
}> => {
  try {
    const reports = await prisma.report.findMany({
      where: { userId, workspaceId },
      include: { user: true },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, reports };
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    return { success: false, error: "Failed to fetch reports" };
  }
};

export const handleReportDelete = async (id: string) => {
  const reportDelete = await prisma.report.delete({
    where: {
      id,
    },
  });
  return reportDelete;
};

export const handleReportDownload = async (
  userId: string,
  workspaceId: string,
  from?: Date,
  to?: Date
) => {
  const documents = await prisma.document.findMany({
    where: {
      userId,
      workspaceId,
      ...(from && { createdAt: { gte: from } }),
      ...(to && { createdAt: { lte: to } }),
    },
  });

  // You might want to adjust these counts based on the same filters applied to documents if needed
  const ongoingDocuments = await prisma.document.count({
    where: { status: "ongoing", userId, workspaceId },
  });
  const completedDocuments = await prisma.document.count({
    where: { status: "completed", userId, workspaceId },
  });
  const sharedDocuments = await prisma.document.count({
    where: { shared: true, userId, workspaceId },
  });

  return {
    documents,
    ongoingDocuments,
    completedDocuments,
    sharedDocuments,
  };
};
