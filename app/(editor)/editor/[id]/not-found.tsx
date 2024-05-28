import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Icons } from "@/components/icons";

export default function NotFound() {
  return (
    <EmptyPlaceholder className="h-svh">
      <EmptyPlaceholder.Icon name="warning" />
      <EmptyPlaceholder.Title>Document not found</EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>
        It seems like the document you&apos;re looking for does not exist or
        might have been removed.
      </EmptyPlaceholder.Description>
      <div className="mt-6 flex gap-4">
        <Link
          href="/documents"
          className={buttonVariants({ variant: "outline" })}
        >
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
        <Link
          href="/overview"
          className={buttonVariants({ variant: "default" })}
        >
          Dashboard
        </Link>
      </div>
    </EmptyPlaceholder>
  );
}
