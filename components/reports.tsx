import { Badge } from "@/components/ui/badge";
import type { Report, User } from "@prisma/client";
import { Status } from "@prisma/client";
import { format } from "date-fns";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchReports } from "@/app/actions/reports";
import { ReportActions } from "./report-actions";
import { getCurrentUser } from "@/lib/session";
import { getCurrentWorkspaceId } from "@/app/actions/workspace";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ReportWithUser = Report & {
  user: User;
};

export const revalidate = 60;

export async function ReportsData() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User not found");
  }

  const workspaceId = await getCurrentWorkspaceId(user.id);
  if (!workspaceId) {
    throw new Error("Workspace not found or access denied");
  }

  let reports: ReportWithUser[] = [];
  let error: string | null = null;

  try {
    const result = await fetchReports(user.id, workspaceId);
    if (result.success) {
      reports = result.reports ?? [];
    } else {
      error = result.error ?? "Failed to load reports";
    }
  } catch (err) {
    error = "Failed to load reports";
    console.error("Error fetching reports: ", err);
  }

  if (error) return <div>Error fetching reports: {error}</div>;

  return (
    <Table>
      <TableCaption>
        Reports will be deleted permanently after 30 days.
      </TableCaption>
      <Suspense fallback={<Skeleton className="h-64 rounded-lg" />}>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>User</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">{report.title}</TableCell>

              <TableCell className="text-gray-500">
                <Badge
                  variant={
                    report.status === Status.Failed ? "destructive" : "default"
                  }
                >
                  {report.status}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-500">
                {format(new Date(report.createdAt), "PP")}
              </TableCell>
              <TableCell className="text-gray-500">
                {report.user.name}
              </TableCell>
              <TableCell>
                <ReportActions report={report} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Suspense>
    </Table>
  );
}
