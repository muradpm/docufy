"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { SendHorizonal } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { z } from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const feedbackFormSchema = z.object({
  feedback: z.string().min(1),
});

export function FeedbackIssue() {
  const [feedback, setFeedback] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email) return;

    const formData = {
      feedback,
    };

    const result = feedbackFormSchema.safeParse(formData);

    if (!result.success) {
      toast({
        description: "Please make sure the feedback field is filled out.",
        variant: "destructive",
      });
      return;
    }

    const response = await fetch("/api/user/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        feedback,
        email: session.user.email,
      }),
    });

    if (response.ok) {
      toast({
        title: "Feedback received",
        description:
          "Thanks for your feedback! We are working hard to make this happen.",
      });
      setFeedback("");
      setOpen(false);
    } else {
      toast({
        title: "Failed to send feedback",
        description: "Please refresh the page and try again later.",
        variant: "destructive",
      });
    }
  };

  const togglePopover = () => setOpen(!open);

  return (
    <Popover open={open} onOpenChange={togglePopover}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="text-sm font-normal text-gray-500">
          Feedback
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Report an issue</h4>
              <p className="text-sm text-muted-foreground">
                What area are you having problems with?
              </p>
            </div>
            <div className="grid gap-2">
              <Textarea
                name="feedback"
                placeholder="Please include all information relevant to your issue."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="h-32"
              />
            </div>
          </div>
          <div className="flex justify-end items-center space-x-2 pt-4">
            <Button type="submit" size="sm" className="px-3">
              <SendHorizonal className="mr-2 h-4 w-4" />
              Send
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
