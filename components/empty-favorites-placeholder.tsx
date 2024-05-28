import * as React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

interface EmptyPlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
  show: boolean;
}

export function EmptyFavoritePlaceholder({
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
        <EmptyFavoritePlaceholder.Icon name="star" />
        <EmptyFavoritePlaceholder.Title>
          No favorite documents
        </EmptyFavoritePlaceholder.Title>
        <EmptyFavoritePlaceholder.Description>
          Mark a document as a favorite to see it here.
        </EmptyFavoritePlaceholder.Description>
      </div>
    </div>
  );
}

interface EmptyPlaceholderIconProps
  extends Partial<React.SVGProps<SVGSVGElement>> {
  name: keyof typeof Icons;
}

EmptyFavoritePlaceholder.Icon = function EmptyPlaceHolderIcon({
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

EmptyFavoritePlaceholder.Title = function EmptyPlaceholderTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("mt-6 text-xl font-semibold", className)} {...props} />
  );
};

EmptyFavoritePlaceholder.Description = function EmptyPlaceholderDescription({
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
