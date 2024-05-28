"use client";

import * as React from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import type { User, Role } from "@prisma/client";
import { roles } from "./access-data";
import {
  handleMemberDelete,
  handleMemberRoleChange,
} from "@/app/actions/team-member";
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

interface TeamActionsProps {
  user: User;
}

export const TeamActions: React.FC<TeamActionsProps> = ({ user }) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  if (!userId) {
    console.error("User not identified");
    return null;
  }

  const deleteMember = async () => {
    try {
      await handleMemberDelete(user.id);
      router.refresh();
      toast({
        description: "Member successfully deleted.",
      });
    } catch (error) {
      toast({
        description: "Failed to delete the member.",
      });
    }
  };

  const updateRole = async (newRole: Role) => {
    try {
      await handleMemberRoleChange(user.id, newRole);
      router.refresh();
      toast({
        description: "Role has been updated.",
      });
    } catch (error) {
      console.error("Role update error: ", error);
      toast({
        description: "Failed to update the role.",
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
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Role</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={user.role.toLowerCase()}
                onValueChange={(value) => updateRole(value as Role)}
              >
                {roles.map((role) => (
                  <DropdownMenuRadioItem key={role.value} value={role.value}>
                    <role.icon className="mr-2 h-4 w-4" />
                    {role.label}
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
                await deleteMember();
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
