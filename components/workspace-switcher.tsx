"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  CaretSortIcon,
  CheckIcon,
  MixerHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface WorkspaceSwitcherProps extends PopoverTriggerProps {
  workspaceName: string;
}

export default function WorkspaceSwitcher({
  className,
  workspaceName,
}: WorkspaceSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [showNewWorkspaceDialog, setShowNewWorkspaceDialog] =
    React.useState(false);

  const groups = [
    {
      label: "Workspace",
      workspace: [
        {
          label: workspaceName,
          value: workspaceName.toLowerCase().replace(/\s+/g, "-"),
        },
      ],
    },
  ];

  const [selectedWorkspace, setSelectedWorkspace] = React.useState(
    groups[0].workspace[0]
  );

  return (
    <Dialog
      open={showNewWorkspaceDialog}
      onOpenChange={setShowNewWorkspaceDialog}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a workspace"
            className={cn("w-[200px] justify-between", className)}
          >
            <Avatar className="mr-2 h-7 w-7">
              <AvatarImage
                src={`https://avatar.vercel.sh/${selectedWorkspace.value}.png`}
                alt={selectedWorkspace.label}
                className="grayscale"
              />
              <AvatarFallback>:)</AvatarFallback>
            </Avatar>
            {workspaceName || selectedWorkspace.label}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              {groups.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.workspace.map((workspace) => (
                    <CommandItem
                      key={workspace.value}
                      onSelect={() => {
                        setSelectedWorkspace(workspace);
                        setOpen(false);
                      }}
                      className="text-sm"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${workspace.value}.png`}
                          alt={workspace.label}
                          className="grayscale"
                        />
                        <AvatarFallback>:)</AvatarFallback>
                      </Avatar>
                      {workspace.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedWorkspace.value === workspace.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                    }}
                  >
                    <Link
                      href="/settings/workspace"
                      className="flex items-center"
                    >
                      <MixerHorizontalIcon className="mr-2 h-4 w-4" />
                      <span>Manage workspace</span>
                    </Link>
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </Dialog>
  );
}
