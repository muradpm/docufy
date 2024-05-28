import * as React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { NewDocumentButton } from "./document-create-button";

interface EmptyPlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
  show: boolean;
}

export function EmptyPlaceholder({
  className,
  show,
  ...props
}: EmptyPlaceholderProps) {
  if (!show) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-md p-8 text-center animate-in fade-in-50",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <EmptyPlaceholder.Icon name="document" />
        <EmptyPlaceholder.Title>No documents created</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          You don&apos;t have any documents yet. Start creating content.
        </EmptyPlaceholder.Description>
        <NewDocumentButton variant="outline" />
      </div>
    </div>
  );
}

interface EmptyPlaceholderIconProps
  extends Partial<React.SVGProps<SVGSVGElement>> {
  name: keyof typeof Icons;
}

EmptyPlaceholder.Icon = function EmptyPlaceHolderIcon({
  name,
  className,
  ref,
  ...props
}: EmptyPlaceholderIconProps) {
  const Icon = Icons[name];

  if (!Icon) {
    return null;
  }

  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
      <Icon className={cn("h-10 w-10", className)} {...props} />
    </div>
  );
};

EmptyPlaceholder.Title = function EmptyPlaceholderTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("mt-6 text-xl font-semibold", className)} {...props} />
  );
};

EmptyPlaceholder.Description = function EmptyPlaceholderDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground",
        className
      )}
      {...props}
    />
  );
};
