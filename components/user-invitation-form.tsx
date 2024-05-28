"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleSendInvitation } from "@/app/actions/team-member";
import { Role } from "@prisma/client";
import { getCurrentWorkspaceId } from "@/app/actions/workspace";
import { useSession } from "next-auth/react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { userAuthSchema } from "@/lib/validations/auth";
import { toast } from "./ui/use-toast";
import { UserPlus } from "lucide-react";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "./ui/select";

interface FormData {
  email: string;
}

interface UserInvitationFormProps {
  className?: string;
}

export const UserInvitationForm: React.FC<UserInvitationFormProps> = ({
  className,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [role, setRole] = React.useState<Role>(Role.Member);
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "";

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    if (!userId) {
      console.error("User ID is undefined");
      setIsLoading(false);
      return;
    }

    try {
      const workspaceId = await getCurrentWorkspaceId(userId);
      const email = data.email;
      if (!workspaceId) {
        throw new Error("Workspace ID not found");
      }

      await handleSendInvitation(workspaceId, email, role);

      toast({
        description: "We sent an invite link to the user.",
      });
    } catch (error) {
      console.error("Failed to send invitation:", error);
      toast({
        title: "Something went wrong",
        description: "Your invite request failed. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      reset();
    }
  };

  const handleRoleChange = (selectedRole: string) => {
    if (Object.values(Role).includes(selectedRole as Role)) {
      setRole(selectedRole as Role);
    }
  };

  return (
    <div className={cn(className)}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-2 items-center"
      >
        <Select onValueChange={handleRoleChange} value={role} name="role">
          <SelectTrigger id="role" className="w-[180px]">
            <SelectValue placeholder="Select role">{role}</SelectValue>
          </SelectTrigger>
          <SelectContent position="popper">
            {Object.values(Role).map((roleValue) => (
              <SelectItem key={roleValue} value={roleValue.toLowerCase()}>
                {roleValue}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          id="email"
          placeholder="Enter your email address..."
          type="email"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect="off"
          disabled={isLoading}
          {...register("email")}
        />
        {errors?.email && (
          <p className="px-1 text-xs text-red-600">{errors.email.message}</p>
        )}
        <Button className="flex-shrink-0">
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="mr-2 h-4 w-4" />
          )}
          Invite
        </Button>
      </form>
    </div>
  );
};
