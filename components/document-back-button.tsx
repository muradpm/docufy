"use client";

import { useState, useContext } from "react";
import type { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { DocumentStateContext } from "@/utils/document-state-serializers";
import { useToast } from "@/components/ui/use-toast";
import type { Document } from "@prisma/client";
import { handleDocumentSave } from "@/app/actions/documents";
import { getCurrentWorkspaceId } from "@/app/actions/workspace";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useSession } from "next-auth/react";
import { useAiStore } from "@/store/ai-store";

interface DocumentBackButtonProps {
  document?: Document;
  editor: Editor;
  title: string;
  defaultTitle: string;
  defaultContent: string;
  hasChanges: boolean;
}

export function DocumentBackButton({
  document,
  editor,
  title,
  defaultTitle,
  defaultContent,
  hasChanges,
}: DocumentBackButtonProps) {
  const router = useRouter();
  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "";
  const { contextEnabled } = useAiStore();

  const titleContext = useContext(DocumentStateContext);
  const changesContext = useContext(DocumentStateContext);

  if (!titleContext || !changesContext) {
    throw new Error(
      "DocumentBackButton requires both title and change tracking contexts"
    );
  }

  const { setTitle } = titleContext;
  const { setHasChanges } = changesContext;

  const handleBackClick = () => {
    if (hasChanges) {
      setShowAlertDialog(true);
    } else {
      router.back();
      // router.refresh();
    }
  };

  const handleDiscardAndBack = () => {
    // Reset the title and content to their default values
    setTitle(defaultTitle);
    editor?.chain().setContent(defaultContent).run();
    setHasChanges(false);
    router.push("/documents");
  };

  const handleSaveAndBack = async () => {
    try {
      const workspaceId = await getCurrentWorkspaceId(userId);
      await handleDocumentSave(
        document?.id ?? "",
        workspaceId,
        title,
        editor?.getHTML() ?? "",
        contextEnabled
      );
      toast({
        description: "Your changes have been saved.",
      });
      setHasChanges(false);
      router.push("/documents");
    } catch (error) {
      const err = error as Error;
      toast({
        description: `Error: ${err.message}`,
      });
    }
  };

  return (
    <>
      <Button variant="ghost" onClick={handleBackClick}>
        <Icons.chevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved changes detected</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to save before leaving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDiscardAndBack}>
              Discard
            </AlertDialogCancel>
            <Button
              variant="default"
              onClick={async () => {
                setShowAlertDialog(false);
                await handleSaveAndBack();
              }}
            >
              Save
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
