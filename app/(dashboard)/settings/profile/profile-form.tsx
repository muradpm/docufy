"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { createClient } from "@/utils/supabase/client";
import { PasswordInput } from "@/components/password-input";
import { handleUserDelete } from "@/app/actions/delete-user";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Save, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const profileFormSchema = z.object({
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

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const router = useRouter();
  const supabase = createClient();
  const { data: session } = useSession();
  const [avatarUrl, setAvatarUrl] = useState(session?.user?.image ?? "");

  const defaultValues: Partial<ProfileFormValues> = {
    name: session?.user?.name ?? "",
    email: session?.user?.email ?? "",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  useEffect(() => {
    setAvatarUrl(session?.user?.image ?? "");
  }, [session?.user?.image]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const filePath = `avatars/${session?.user?.id}/${file.name}`;

    const { data, error } = await supabase.storage
      .from("profile_image")
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (error) {
      console.error("Failed to upload avatar:", error.message);
      toast({ description: "Failed to upload profile image." });
    } else {
      const url = `${
        process.env.NEXT_PUBLIC_SUPABASE_URL
      }/storage/v1/object/public/profile_image/${
        data?.path
      }?t=${new Date().getTime()}`;
      setAvatarUrl(url);
      toast({ description: "Profile image updated successfully." });
    }
  };

  async function onSubmit(data: ProfileFormValues) {
    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          name: data.name,
          email: data.email,
          avatarUrl: avatarUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast({
        description: "Your changes have been saved.",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        description: "Failed to save changes.",
      });
    }
  }

  const handleDeleteAccount = async (
    session: ReturnType<typeof useSession>["data"]
  ) => {
    try {
      await handleUserDelete(session?.user?.id as string);
      toast({
        description: "Your account has been deleted.",
      });
      router.push("/login");
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast({
        description: "Failed to delete account.",
      });
    }
  };

  return (
    <Form {...form}>
      <div className="col-span-full flex items-center gap-x-8">
        {avatarUrl && (
          <Image
            src={avatarUrl ?? session?.user?.image ?? ""}
            alt="Profile image"
            className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
            width={96}
            height={96}
            priority
          />
        )}
        <div>
          <label
            htmlFor="avatarInput"
            className="button-class rounded-md px-3 py-2 text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
          >
            <input
              id="avatarInput"
              type="file"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />
            Change avatar
          </label>
          <p className="mt-2 text-xs leading-5 text-gray-400">
            JPEG or PNG. 1MB max.
          </p>
        </div>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Write your name here"
                  autoComplete="name"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the name that will be displayed on your profile and in
                emails.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Your email" {...field} />
              </FormControl>
              <FormDescription>
                This is the email that will be displayed on your profile and in
                emails.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" /> Update profile
        </Button>
        <div>
          <FormLabel>Password</FormLabel>
          <FormDescription>Changes a password of your account.</FormDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Change password</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[475px]">
            <DialogHeader>
              <DialogTitle>Change password</DialogTitle>
              <DialogDescription>
                Use a password at least 15 letters long, or at least 8
                characters long with both letters and numbers.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="password">Enter a new password</Label>
                <PasswordInput
                  id="password"
                  autoFocus
                  autoComplete="new-password"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="second-password">
                  Confirm your new password
                </Label>
                <PasswordInput
                  id="password"
                  autoComplete="confirm-new-password"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Separator />
        <div>
          <FormLabel>Danger zone</FormLabel>
          <FormDescription>
            Permanently delete an account and remove access to the application.
          </FormDescription>
        </div>
        <div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteAccount(session)}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </form>
    </Form>
  );
}
