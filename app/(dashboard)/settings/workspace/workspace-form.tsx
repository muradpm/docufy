"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createClient } from "@/utils/supabase/client";
import { handleWorkspaceNameUpdate } from "@/app/actions/workspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCurrentWorkspaceId } from "@/app/actions/workspace";
import { Save } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const workspaceFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  email: z.string().email({
    message: "Invalid email address",
  }),
});

type WorkspaceFormValues = z.infer<typeof workspaceFormSchema>;

type WorkspaceFormProps = {
  initialWorkspaceName: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function WorkspaceForm({
  initialWorkspaceName,
  className,
  ...props
}: WorkspaceFormProps) {
  const defaultValues: Partial<WorkspaceFormValues> = {
    name: initialWorkspaceName,
  };

  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const supabase = createClient();
  const form = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceFormSchema),
    defaultValues,
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const filePath = `images/${file.name}`;

    const { data, error } = await supabase.storage
      .from("workspace_image")
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (error) {
      console.error("Failed to upload image:", error.message);
      toast({ description: "Failed to upload workspace image." });
    } else {
      const url = `${
        process.env.NEXT_PUBLIC_SUPABASE_URL
      }/storage/v1/object/public/workspace_image/${
        data?.path
      }?t=${new Date().getTime()}`;

      toast({ description: "Workspace image updated successfully." });
    }
  };

  async function onSubmit(data: WorkspaceFormValues) {
    try {
      const response = await fetch("/api/workspace", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update workspace");
      }
      toast({
        description: "Your changes have been saved.",
      });
    } catch (error) {
      console.error("Failed to update workspace:", error);
      toast({
        description: "Failed to save changes.",
      });
    }
  }

  const updateWorkspaceName = async () => {
    if (!userId) {
      console.error("User ID is undefined.");

      return;
    }

    setIsLoading(true);

    try {
      const workspaceId = await getCurrentWorkspaceId(userId);
      await handleWorkspaceNameUpdate(workspaceId, form.getValues().name);

      toast({
        description: "Workspace name successfully updated.",
      });
    } catch (error) {
      toast({
        description: "Failed to update workspace name.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <div className="col-span-full flex items-center gap-x-8">
          <Image
            src={`https://avatar.vercel.sh/${defaultValues.name}.png`}
            alt="Workspace image"
            className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover grayscale"
            width={96}
            height={96}
            priority
          />
          <div>
            <label
              htmlFor="imageInput"
              className="button-class rounded-md px-3 py-2 text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
            >
              <input
                id="imageInput"
                type="file"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              Change image
            </label>
            <p className="mt-2 text-xs leading-5 text-gray-400">
              JPEG or PNG. 1MB max.
            </p>
          </div>
        </div>
        <div className={cn("max-w-4xl mx-auto my-8", className)} {...props}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Write your workspace name here"
                      autoComplete="workspace"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the name that will be displayed as your workspace.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" onClick={() => updateWorkspaceName()}>
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Update workspace
            </Button>
          </form>
        </div>
      </Form>
    </>
  );
}
