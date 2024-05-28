"use client";

import * as React from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { getCurrentWorkspaceId } from "@/app/actions/workspace";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import type { User } from "@prisma/client";
import {
  handleInvitationDelete,
  handleSendInvitation,
} from "@/app/actions/team-member";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

interface TeamInvitationProps {
  user: User;
  onInvitationDeleted: (invitationId: string) => void;
}

export const TeamInvitationActions: React.FC<TeamInvitationProps> = ({
  user,
  onInvitationDeleted,
}) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  if (!userId) {
    console.error("User not identified");
    return null;
  }

  const resendInvitation = async () => {
    try {
      const workspaceId = await getCurrentWorkspaceId(userId);
      const email = user.email;
      const role = user.role;

      if (email === null) {
        toast({
          description: "Please make sure the email field is filled out",
          variant: "destructive",
        });
        return;
      }

      await handleSendInvitation(workspaceId, email, role);
      toast({
        description: "Invitation successfully resent.",
      });
    } catch (error) {
      toast({
        description: "Failed to resend the invitation.",
      });
    }
  };

  const deleteInvitation = async () => {
    try {
      await handleInvitationDelete(user.id);
      onInvitationDeleted(user.id);
      router.refresh();
      toast({
        description: "Invitation successfully deleted.",
      });
    } catch (error) {
      toast({
        description: "Failed to delete the invitation.",
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
          <DropdownMenuItem onSelect={resendInvitation}>
            Resend invitation
          </DropdownMenuItem>
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
                await deleteInvitation();
                toast({
                  description: "This member has been deleted.",
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
