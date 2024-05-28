import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Suspense } from "react";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

function UserAuthFormFallback() {
  return <div>Loading...</div>;
}

const DynamicUserAuthForm = dynamic(
  () => import("../user-auth-form").then((mod) => ({ default: mod.UserAuthForm })),
  {
    suspense: true,
  }
);

export default function LoginPage() {
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        <Icons.chevronLeft className="mr-2 h-4 w-4" />
        Back
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gray-950" />
        <div className="relative z-20 flex items-center text-lg font-medium">docufy</div>
        <span className="text-sm text-muted-foreground z-30 relative">
          Empower your writing with intelligence
        </span>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.brand className="mx-auto h-12 w-12" />
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email to log in to your account
            </p>
          </div>
          <Suspense fallback={<UserAuthFormFallback />}>
            <DynamicUserAuthForm />
          </Suspense>
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              href="/signup"
              className="hover:text-brand underline underline-offset-4"
            >
              Don&apos;t have an account? Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
