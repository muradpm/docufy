"use client";

import * as React from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { statuses, priorities } from "./data";
import type { Document } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getCurrentWorkspaceId } from "@/app/actions/workspace";
import {
  handleDocumentDelete,
  handleDocumentCopy,
  handleDocumentFavoriteToggle,
  handleDocumentStatusChange,
  handleDocumentPriorityChange,
} from "@/app/actions/documents";

interface DocumentActionsProps {
  document: Document;
  // onDeleteDocument: (id: string) => void;
  // onCreateDocument: (newDocument: Document) => void;
  // onUpdateDocument: (updatedDocument: Document) => void;
  // onStatusChange: (id: string, newStatus: string) => void;
  // onPriorityChange: (id: string, newPriority: string) => void;
}

export const DocumentActions: React.FC<DocumentActionsProps> = ({
  document,
  // onDeleteDocument,
  // onCreateDocument,
  // onUpdateDocument,
  // onStatusChange,
  // onPriorityChange,
}) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  if (!userId) {
    console.error("User not identified");
    return null;
  }

  const deleteDocument = async () => {
    try {
      const workspaceId = await getCurrentWorkspaceId(userId);

      await handleDocumentDelete(document.id, workspaceId);
      router.refresh();
      toast({
        description: "Document successfully deleted.",
      });
    } catch (error) {
      toast({
        description: "Failed to delete the document.",
      });
    }
  };

  const handleCopyClick = async () => {
    try {
      const newTitle = `${document.title} (copy)`;
      const lastAccessed = new Date();
      const workspaceId = await getCurrentWorkspaceId(userId);

      await handleDocumentCopy(
        document.id,
        newTitle,
        workspaceId,
        lastAccessed
      );
      router.refresh();
      toast({
        description: "This document has been copied.",
      });
    } catch (error) {
      console.error("Copy document error: ", error);
      toast({
        description: "Failed to copy the document.",
      });
    }
  };

  const handleFavoriteClick = async () => {
    try {
      const workspaceId = await getCurrentWorkspaceId(userId);
      const updatedDocument = await handleDocumentFavoriteToggle(
        document.id,
        workspaceId
      );
      router.refresh();
      // onUpdateDocument(updatedDocument);
      toast({
        description: updatedDocument.favorite
          ? "This document has been added to favorites."
          : "This document has been removed from favorites.",
      });
    } catch (error) {
      console.error("Favorite error: ", error);
      toast({
        description: "Failed to favorite the document.",
      });
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      const workspaceId = await getCurrentWorkspaceId(userId);
      await handleDocumentStatusChange(document.id, newStatus, workspaceId);
      router.refresh();
      toast({
        description: "Status has been updated.",
      });
      // onStatusChange(document.id, newStatus);
    } catch (error) {
      console.error("Status update error: ", error);
      toast({
        description: "Failed to update the status.",
      });
    }
  };

  const updatePriority = async (newPriority: string) => {
    try {
      const workspaceId = await getCurrentWorkspaceId(userId);
      await handleDocumentPriorityChange(document.id, newPriority, workspaceId);
      router.refresh();
      toast({
        description: "Priority has been updated.",
      });
      // onPriorityChange(document.id, newPriority);
    } catch (error) {
      console.error("Priority update error: ", error);
      toast({
        description: "Failed to update the priority.",
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem>
            <Link
              href={`/editor/${document.id}`}
              className="flex items-center w-full h-full text-left"
            >
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleCopyClick}>
            Make a copy
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleFavoriteClick}>
            Favorite
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={document.status}
                onValueChange={updateStatus}
              >
                {statuses.map((status) => (
                  <DropdownMenuRadioItem
                    key={status.value}
                    value={status.value}
                  >
                    <status.icon className="mr-2" />
                    {status.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Priority</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={document.priority ?? undefined}
                onValueChange={updatePriority}
              >
                {priorities.map((priority) => (
                  <DropdownMenuRadioItem
                    key={priority.value}
                    value={priority.value}
                  >
                    <priority.icon className="mr-2" />
                    {priority.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={async () => {
                setShowDeleteDialog(false);
                await deleteDocument();
                toast({
                  description: "This document has been deleted.",
                });
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
