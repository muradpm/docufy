import Content from "./content.mdx";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useMDXComponents } from "@/mdx-components";
import "@/styles/mdx.css";

export default function TermsPage() {
  return (
    <article className="container relative max-w-3xl py-6 lg:py-10">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-[-200px] top-14 hidden xl:inline-flex"
        )}
      >
        <Icons.chevronLeft className="mr-2 h-4 w-4" />
        Back
      </Link>
      <div className="mdx-content">
        <Content components={useMDXComponents()} />
      </div>
    </article>
  );
}
