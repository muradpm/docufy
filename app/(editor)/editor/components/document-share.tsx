"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { CopyIcon } from "@radix-ui/react-icons";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useSharedStore } from "@/store/shared-store";
import { handleDocumentSharedChangeTest } from "@/app/actions/documents";
import { getCurrentWorkspaceId } from "@/app/actions/workspace";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DocumentShareProps = {
  documentId: string;
};

export function DocumentShare({ documentId }: DocumentShareProps) {
  const { toast } = useToast();
  const { sharedState, setSharedState } = useSharedStore();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Initialize documentLink with an empty string
  let documentLink = "";

  if (typeof window !== "undefined") {
    documentLink = `${window.location.origin}/editor/shared?documentId=${documentId}`;
  }

  // Initialize shared state from local storage
  useEffect(() => {
    const storedSharedState = localStorage.getItem(`sharedState-${documentId}`);
    if (storedSharedState) {
      setSharedState(documentId, JSON.parse(storedSharedState));
    }
  }, [documentId, setSharedState]);

  const handleCopyLinkClick = async () => {
    try {
      await navigator.clipboard.writeText(documentLink);
      toast({
        description: "The link has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        description: "Failed to copy the link.",
      });
    }
  };

  const handleShareToggled = async () => {
    const newSharedState = !sharedState[documentId];
    setSharedState(documentId, newSharedState);

    localStorage.setItem(
      `sharedState-${documentId}`,
      JSON.stringify(newSharedState)
    );

    if (typeof userId === "undefined") {
      throw new Error("User ID is undefined");
    }

    const workspaceId = await getCurrentWorkspaceId(userId);
    if (!workspaceId) {
      throw new Error("No workspace ID found for the user.");
    }

    try {
      await handleDocumentSharedChangeTest(
        documentId,
        newSharedState,
        workspaceId
      );
      toast({
        title: "Document sharing status updated",
        description: newSharedState
          ? "The sharing link has been activated."
          : "The sharing link has been deactivated.",
      });
    } catch (error) {
      console.error(
        "Failed to update document sharing status in the backend",
        error
      );
      toast({
        description: "Failed to update document sharing status.",
      });
      setSharedState(documentId, !newSharedState);
      localStorage.setItem(
        `sharedState-${documentId}`,
        JSON.stringify(!newSharedState)
      );
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Share</Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[520px]">
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          <h3 className="text-lg font-semibold">Share preset</h3>
          <p className="text-sm text-muted-foreground">
            Anyone who has this link will be able to view this document.
          </p>
        </div>
        <div className="flex items-center space-x-2 pt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" value={documentLink} readOnly className="h-9" />
          </div>
          <Button
            type="submit"
            size="sm"
            className="px-3"
            onClick={handleCopyLinkClick}
          >
            <span className="sr-only">Copy</span>
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <Switch
            id="shared-mode"
            checked={!!sharedState[documentId]}
            onCheckedChange={() => handleShareToggled()}
          />
          <Label htmlFor="shared-mode">Share</Label>
        </div>
      </PopoverContent>
    </Popover>
  );
}
