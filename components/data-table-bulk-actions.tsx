"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Table } from "@tanstack/react-table";
import { toast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";
import { handleDocumentBulkDelete } from "@/app/actions/documents";
import { getCurrentWorkspaceId } from "@/app/actions/workspace";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface WithId {
  id: string;
}

interface DataTableBulkActionsProps<TData extends WithId> {
  table: Table<TData>;
  onMassBulkDocuments: (selectedIds: string[]) => void;
}

export function DataTableBulkActions<TData extends WithId>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const selectedIds = table
    .getSelectedRowModel()
    .flatRows.map((row) => row.original.id);

  const handleBulkDelete = async () => {
    if (typeof userId === "undefined") {
      throw new Error("User ID is undefined");
    }

    const workspaceId = await getCurrentWorkspaceId(userId);
    if (!workspaceId) {
      throw new Error("No workspace ID found for the user.");
    }

    setShowBulkDeleteDialog(false);
    try {
      await handleDocumentBulkDelete(selectedIds, workspaceId);
      router.refresh();
      table.resetRowSelection();
      toast({
        description: "Selected documents have been deleted.",
      });
    } catch (error) {
      console.error(error);
      toast({
        description: "An error occurred while deleting documents.",
      });
    }
  };

  return (
    <div>
      {selectedIds.length > 1 && (
        <>
          <Button
            onClick={() => setShowBulkDeleteDialog(true)}
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 lg:flex"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <AlertDialog
            open={showBulkDeleteDialog}
            onOpenChange={setShowBulkDeleteDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete all selected documents.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => setShowBulkDeleteDialog(false)}
                >
                  Cancel
                </AlertDialogCancel>
                <Button variant="destructive" onClick={handleBulkDelete}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
