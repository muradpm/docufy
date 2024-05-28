"use client";

import { useState, useContext } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { DocumentStateContext } from "@/utils/document-state-serializers";
import { handleDocumentSave } from "@/app/actions/documents";
import { getCurrentWorkspaceId } from "@/app/actions/workspace";
import type { Document } from "@prisma/client";
import type { Editor } from "@tiptap/core";

interface DocumentSaveButtonProps {
  document?: Document;
  editor: Editor;
  title: string;
  contextEnabled?: boolean;
}

export function DocumentSaveButton({
  document,
  editor,
  title,
  contextEnabled,
}: DocumentSaveButtonProps) {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { toast } = useToast();
  const context = useContext(DocumentStateContext);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  if (!context) {
    throw new Error(
      "DocumentSaveButton must be used within a HasChangesContext.Provider"
    );
  }

  const { setHasChanges } = context;

  const saveDocument = async () => {
    setIsSaving(true);
    try {
      if (typeof userId === "undefined") {
        throw new Error("User ID is undefined");
      }

      const workspaceId = await getCurrentWorkspaceId(userId);
      if (!workspaceId) {
        throw new Error("No workspace ID found for the user.");
      }

      await handleDocumentSave(
        document?.id ?? "",
        title,
        editor?.getHTML(),
        workspaceId,
        contextEnabled ?? false
      );
      setHasChanges(false);
      toast({
        description: "Your changes have been saved.",
      });
    } catch (error) {
      toast({
        description: "Error saving changes.",
      });
    }
    setIsSaving(false);
  };

  return (
    <Button onClick={saveDocument} className={cn(buttonVariants())}>
      {isSaving ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.save className="mr-2 h-4 w-4" />
      )}
      Save
    </Button>
  );
}
