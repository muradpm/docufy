"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <EmptyPlaceholder className="h-svh">
      <EmptyPlaceholder.Icon name="warning" />
      <EmptyPlaceholder.Title>
        Uh oh! Something went wrong
      </EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>
        It seems like something happens on our side. Please try again later.
      </EmptyPlaceholder.Description>
      <div className="mt-6 flex gap-4">
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </EmptyPlaceholder>
  );
}
