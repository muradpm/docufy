"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useDisplayNav } from "@/components/display-nav";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Save } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";

const items = [
  {
    id: "overview",
    label: "Overview",
  },
  {
    id: "documents",
    label: "Documents",
  },
  {
    id: "favorites",
    label: "Favorites",
  },
] as const;

const displayFormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

type DisplayFormValues = z.infer<typeof displayFormSchema>;

export function DisplayForm() {
  const { setDisplayNav } = useDisplayNav();

  // Load the initial state from localStorage
  let initialItems = items.map((item) => item.id); // default values

  if (typeof window !== "undefined") {
    const storedItems = localStorage.getItem("displayNav");
    if (storedItems) {
      initialItems = JSON.parse(storedItems) as typeof initialItems;
    }
  }

  const form = useForm<DisplayFormValues>({
    resolver: zodResolver(displayFormSchema),
    defaultValues: { items: initialItems },
  });

  function onSubmit(data: DisplayFormValues) {
    setDisplayNav(data.items);

    // Save the state to localStorage
    localStorage.setItem("displayNav", JSON.stringify(data.items));

    toast({
      description: "Your changes have been saved.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Sidebar
                </FormLabel>

                <FormDescription>
                  Select the items you want to display in the sidebar.
                </FormDescription>
              </div>
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          Update display
        </Button>
      </form>
    </Form>
  );
}
