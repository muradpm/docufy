import { columns } from "@/components/columns";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { DataTable } from "@/components/data-table";
import { NewDocumentButton } from "@/components/document-create-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListView } from "@/components/list-view";
import { AlignJustify, TableProperties } from "lucide-react";
import { EmptyPlaceholder } from "@/components/empty-document-placeholder";
import { fetchDocuments } from "@/app/actions/documents";
import { getCurrentWorkspaceId } from "@/app/actions/workspace";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const revalidate = 60;

export default async function DocumentPage() {
  const user = await getCurrentUser();

  if (!user || !user.stripeIsActive) {
    redirect("/pricing");
  }

  const workspaceId = await getCurrentWorkspaceId(user.id);

  let documents = await fetchDocuments(user.id, workspaceId);
  documents = documents.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const sharedDocuments = documents
    .filter((doc) => doc.shared)
    .map((doc) => doc.id);

  return (
    <>
      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <span>
              <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
              <p className="text-muted-foreground">
                Create and manage documents.
              </p>
            </span>
            <div className="flex items-center space-x-2">
              <NewDocumentButton />
            </div>
          </div>
        </div>
        <div className="container mx-auto">
          <Suspense fallback={<Skeleton className="h-64 rounded-lg" />}>
            {documents.length > 0 ? (
              <Tabs defaultValue="list" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="list">
                    <AlignJustify className="mr-2 h-4 w-4" />
                    List
                  </TabsTrigger>
                  <TabsTrigger value="table">
                    <TableProperties className="mr-2 h-4 w-4" />
                    Table
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="table">
                  <DataTable data={documents} columns={columns} />
                </TabsContent>
                <TabsContent value="list">
                  <ListView
                    documents={documents}
                    sharedDocuments={sharedDocuments}
                  />
                </TabsContent>
              </Tabs>
            ) : (
              <EmptyPlaceholder show={true} />
            )}
          </Suspense>
        </div>
      </div>
    </>
  );
}
