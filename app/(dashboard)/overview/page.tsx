import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecentDocuments } from "@/components/recent-documents";
import { CalendarDateRangePicker } from "@/components/calendar";
import { fetchActivity, fetchPerformance } from "@/app/actions/charts";
import { ReportsData } from "@/components/reports";
import { getComparisonData } from "@/app/actions/document-comparison";
import { DownloadButton } from "@/components/download-button";
import { EmptyPlaceholder } from "@/components/empty-document-placeholder";
import { LayoutPanelTop, LineChart, FileBarChart2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getCurrentWorkspaceId } from "@/app/actions/workspace";
import {
  fetchDocuments,
  fetchOngoingDocuments,
  fetchCompletedDocuments,
  fetchSharedDocuments,
} from "@/app/actions/documents";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircledIcon,
  Share1Icon,
  StopwatchIcon,
  FileTextIcon,
} from "@radix-ui/react-icons";

export const revalidate = 60;

// Import charts dynamicaly
const Performance = dynamic(() => import("@/components/charts/performance"));
const Activity = dynamic(() => import("@/components/charts/activity"));

export default async function OverviewPage() {
  const user = await getCurrentUser();

  if (!user || !user.stripeIsActive) {
    redirect("/pricing");
  }

  const workspaceId = await getCurrentWorkspaceId(user.id);

  const [
    documents,
    ongoingDocuments,
    completedDocuments,
    sharedDocuments,
    activityData,
  ] = await Promise.all([
    fetchDocuments(user.id, workspaceId),
    fetchOngoingDocuments(user.id, workspaceId),
    fetchCompletedDocuments(user.id, workspaceId),
    fetchSharedDocuments(user.id, workspaceId),
    fetchActivity(user.id, workspaceId),
  ]);

  const dateRange = { from: new Date(), to: new Date() };
  const performanceData = await fetchPerformance(user.id, workspaceId);
  const comparisonData = await getComparisonData(user.id, workspaceId);

  function isInCurrentMonth(date: Date) {
    const postDate = new Date(date);
    const currentDate = new Date();
    return (
      postDate.getMonth() === currentDate.getMonth() &&
      postDate.getFullYear() === currentDate.getFullYear()
    );
  }

  const documentsThisMonth = documents.filter((document) =>
    isInCurrentMonth(document.createdAt)
  ).length;

  return (
    <>
      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <span>
              <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
              <p className="text-muted-foreground">
                Review progress and make decision.
              </p>
            </span>
            <div className="flex items-center space-x-2">
              <CalendarDateRangePicker />
              <DownloadButton
                numberOfDocuments={documents.length}
                numberOfOngoing={ongoingDocuments.length}
                numberOfCompleted={completedDocuments.length}
                numberOfShared={sharedDocuments.length}
                dateRange={dateRange}
              />
            </div>
          </div>
        </div>
        <div className="container mx-auto">
          <Tabs defaultValue="dashboard" className="space-y-4">
            <TabsList>
              <TabsTrigger value="dashboard">
                <LayoutPanelTop className="mr-2 h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <LineChart className="mr-2 h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports">
                <FileBarChart2 className="mr-2 h-4 w-4" />
                Reports
              </TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Documents</CardTitle>
                    <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <Suspense
                      fallback={<Skeleton className="h-12 rounded-lg" />}
                    >
                      <div className="text-3xl font-bold">
                        {documents.length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {comparisonData.created} from last month
                      </p>
                    </Suspense>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Ongoing</CardTitle>
                    <StopwatchIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <Suspense
                      fallback={<Skeleton className="h-12 rounded-lg" />}
                    >
                      <div className="text-3xl font-bold">
                        {ongoingDocuments.length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {comparisonData.ongoing} from last month
                      </p>
                    </Suspense>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Completed</CardTitle>
                    <CheckCircledIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <Suspense
                      fallback={<Skeleton className="h-12 rounded-lg" />}
                    >
                      <div className="text-3xl font-bold">
                        {completedDocuments.length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {comparisonData.completed} from last month
                      </p>
                    </Suspense>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Shared</CardTitle>
                    <Share1Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <Suspense
                      fallback={<Skeleton className="h-12 rounded-lg" />}
                    >
                      <div className="text-3xl font-bold">
                        {sharedDocuments.length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {comparisonData.shared} from last month
                      </p>
                    </Suspense>
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
                <Card className="col-span-1 lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Writing</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      Your document writing activity over time.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Suspense
                      fallback={<Skeleton className="h-64 rounded-lg" />}
                    >
                      <Activity activityData={activityData} />
                    </Suspense>
                  </CardContent>
                </Card>
                <Card className="col-span-1 lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Recent activity</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      You have made {documentsThisMonth} document
                      {documentsThisMonth !== 1 ? "s" : ""} this month.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Suspense
                      fallback={<Skeleton className="h-64 rounded-lg" />}
                    >
                      <RecentDocuments documents={documents} />
                    </Suspense>
                  </CardContent>
                  <EmptyPlaceholder show={documents.length === 0} />
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4 pl-2">
              <h3 className="font-semibold leading-none tracking-tight mt-10">
                Performance
              </h3>
              <span className="text-sm text-muted-foreground">
                Your word count in documents over time.
              </span>
              <Suspense fallback={<Skeleton className="h-64 rounded-lg" />}>
                <Performance performanceData={performanceData} />
              </Suspense>
            </TabsContent>
            <TabsContent value="reports" className="space-y-4 pl-2">
              <h3 className="font-semibold leading-none tracking-tight mt-10">
                Reports
              </h3>
              <span className="text-sm text-muted-foreground">
                Your overall analytics reports.
              </span>
              <ReportsData />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
