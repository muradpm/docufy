" use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { Editor } from "@tiptap/react";
import { useAiStore } from "@/store/ai-store";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

interface AiAssistantProps {
  editor: Editor | null;
}

const FormSchema = z.object({
  context: z.boolean().default(false).optional(),
  grammar: z.boolean().default(false).optional(),
  completion: z.boolean().default(false).optional(),
});

export function AiAssistant({ editor: _editor }: AiAssistantProps) {
  const {
    contextEnabled,
    setContextEnabled,
    grammarEnabled,
    setGrammarEnabled,
    completionEnabled,
    setCompletionEnabled,
  } = useAiStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      context: contextEnabled,
      grammar: grammarEnabled,
      completion: completionEnabled,
    },
  });

  // Update localStorage when contextualization is toggled
  const handleContextualizationToggle = (value: boolean) => {
    setContextEnabled(value);

    toast({
      title: "Context analysis",
      description: `Key topic similarity detection is ${
        value ? "now active" : "turned off"
      }.`,
    });
  };

  // Update localStorage when grammar is toggled
  const handleGrammarToggle = (value: boolean) => {
    setGrammarEnabled(value);

    toast({
      title: "Spelling & grammar",
      description: `Spelling and grammatical correction is ${
        value ? "now active" : "turned off"
      }.`,
    });
  };

  // Update localStorage when autocompletion is toggled
  const handleAutocompletionToggle = (value: boolean) => {
    setCompletionEnabled(value);

    toast({
      title: "Autocompletion",
      description: `Predictive text suggestions are ${
        value ? "now active" : "turned off"
      }.`,
    });
  };

  // Listen for changes in the local storage
  useEffect(() => {
    const context = JSON.parse(localStorage.getItem("context") ?? "false");
    setContextEnabled(context);
  }, []);

  useEffect(() => {
    const grammar = JSON.parse(localStorage.getItem("grammar") ?? "false");
    setGrammarEnabled(grammar);
  }, []);

  useEffect(() => {
    const completion = JSON.parse(
      localStorage.getItem("completion") ?? "false"
    );
    setCompletionEnabled(completion);
  }, []);

  return (
    <Form {...form}>
      <form className="w-full space-y-6">
        <div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="context"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Context analysis
                    </FormLabel>
                    <FormDescription>
                      Activate to detect key topic similarities across
                      documents.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      id="context"
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value);
                        handleContextualizationToggle(value);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="grammar"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base flex items-center">
                      Spelling & grammar
                      <Badge color="primary" className="ml-2">
                        beta
                      </Badge>
                    </FormLabel>
                    <FormDescription>
                      Activate to correct spelling and grammar errors in your
                      text.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      id="grammar"
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value);
                        handleGrammarToggle(value);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="completion"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="flex items-center text-base">
                      Autocompletion
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="ml-2">
                              <HelpCircle className="h-4 w-4" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            Press Tab once to view suggestion. Tab twice to
                            accept.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormDescription>
                      Activate to get real-time predictive text suggestions as
                      you type.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      id="completion"
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value);
                        handleAutocompletionToggle(value);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
