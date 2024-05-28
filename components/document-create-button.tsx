"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Icons } from "@/components/icons";
import { handleDocumentCreate } from "@/app/actions/documents";
import { getCurrentWorkspaceId } from "@/app/actions/workspace";

interface NewDocumentButtonProps {
  variant?: "outline" | "default";
}

export function NewDocumentButton({
  variant = "default",
}: NewDocumentButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const loading = status === "loading";

  async function onClick() {
    setIsLoading(true);
    const title = "Untitled document";
    const content = "";
    const userId = session?.user?.id ?? "";
    const lastAccessed = new Date();

    const workspaceId = await getCurrentWorkspaceId(userId);
    if (!workspaceId) {
      throw new Error("No workspace ID found for the user.");
    }

    const document = await handleDocumentCreate(
      title,
      content,
      userId,
      workspaceId,
      lastAccessed
    );
    router.push(`/editor/${document.id}`);
    setIsLoading(false);
  }

  // Disable the button if the session is loading or there is no user logged in
  const isButtonDisabled = loading || !session?.user;

  return (
    <Button variant={variant} onClick={onClick} disabled={isButtonDisabled}>
      {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.add className="mr-2 h-4 w-4" />
      )}
      New document
    </Button>
  );
}
