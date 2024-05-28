"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DateRange } from "react-day-picker";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Icons } from "@/components/icons";
import { format, startOfMonth } from "date-fns";
import { createReport } from "@/app/actions/reports";
import { getCurrentWorkspaceId } from "@/app/actions/workspace";
import { handleReportDownload } from "@/app/actions/reports";
import type { Document } from "@prisma/client";

interface DownloadButtonProps {
  numberOfDocuments: number;
  numberOfOngoing: number;
  numberOfCompleted: number;
  numberOfShared: number;
  dateRange?: DateRange;
  onDownload?: (filename: string) => void;
}

export function DownloadButton({ dateRange, onDownload }: DownloadButtonProps) {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "";
  const router = useRouter();

  async function reportDownload(
    workspaceId: string,
    filename: string,
    reportUrl: string
  ) {
    try {
      const result = await createReport(
        userId,
        workspaceId,
        filename,
        reportUrl
      );
      if (!result.success) {
        throw new Error(`Server error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error logging download:", error);
    }
  }

  function downloadCSV(csvData: string, filename: string) {
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function onClick() {
    setIsLoading(true);
    const workspaceId = await getCurrentWorkspaceId(userId);

    // Fetch the filtered data from the server
    try {
      // Adjust the call to handleReportDownload to pass the necessary parameters
      const {
        documents,
        ongoingDocuments,
        completedDocuments,
        sharedDocuments,
      } = await handleReportDownload(
        userId,
        workspaceId,
        dateRange?.from,
        dateRange?.to
      );

      const csvData = generateCSVData(
        documents,
        ongoingDocuments,
        completedDocuments,
        sharedDocuments
      );
      const filename = `Report ${format(new Date(), "PP")}`;
      downloadCSV(csvData, filename);

      // Convert CSV data to Blob for uploading
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const filePath = `reports/${userId}/${filename}`;

      // Upload the Blob to Supabase Storage
      const { error } = await supabase.storage
        .from("report_storage")
        .upload(filePath, blob, {
          upsert: true,
          contentType: "text/csv",
        });

      if (error) {
        throw error;
      }

      const reportUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/report_storage/${filePath}`;

      await reportDownload(workspaceId, filename, reportUrl);

      router.refresh();

      if (onDownload) {
        onDownload(filename);
      }
    } catch (error) {
      console.error("Error fetching or uploading documents:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const isButtonDisabled = isLoading || !session?.user || !dateRange;

  return (
    <Button
      onClick={onClick}
      disabled={isButtonDisabled}
      className="DownloadButton"
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.arrowDownToLine className="mr-2 h-4 w-4" />
      )}
      Download report
    </Button>
  );
}

// This function generates the CSV data
function generateCSVData(
  documents: Document[],
  ongoing: number,
  completed: number,
  shared: number
) {
  // Extract unique months from documents
  const uniqueMonths = Array.from(
    new Set(documents.map((doc) => format(startOfMonth(doc.createdAt), "PP")))
  ).sort();

  // Create the header row with months
  const header = [" ", ...uniqueMonths];

  // Initialize counts for each category
  const documentsCount: Record<string, number> = {};
  uniqueMonths.forEach((month) => {
    documentsCount[month] = 0;
  });

  // Populate counts for each month
  documents.forEach((doc) => {
    const monthKey = format(startOfMonth(doc.createdAt), "PP");
    documentsCount[monthKey] = (documentsCount[monthKey] || 0) + 1;
  });

  // Create rows for each category
  const documentsRow = [
    "Documents",
    ...uniqueMonths.map((month) => documentsCount[month].toString()),
  ];
  const ongoingRow = ["Ongoing", ...uniqueMonths.map(() => ongoing.toString())];
  const completedRow = [
    "Completed",
    ...uniqueMonths.map(() => completed.toString()),
  ];
  const sharedRow = ["Shared", ...uniqueMonths.map(() => shared.toString())];

  // Combine the header and rows into a single CSV string
  const rows = [header, documentsRow, ongoingRow, completedRow, sharedRow];
  return rows.map((row) => row.join(",")).join("\n");
}
