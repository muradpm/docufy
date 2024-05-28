"use client";

import React, { useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = useState("");
  const { setTheme } = useTheme();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  React.useEffect(() => {
    if (open) {
      setSearch("");
    }
  }, [open]);

  const handleThemeChange = (theme: string) => {
    setTheme(theme);
    setOpen(false);
  };

  const handleSearchChange = (newSearchValue: string) => {
    setSearch(newSearchValue);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Type a command..."
        value={search}
        onValueChange={handleSearchChange}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Themes">
          <CommandItem onSelect={() => handleThemeChange("light")}>
            <SunIcon className="mr-2 h-4 w-4" />
            <span>Light</span>
          </CommandItem>
          <CommandItem onSelect={() => handleThemeChange("dark")}>
            <MoonIcon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </CommandItem>
        </CommandGroup>
        {/* You can add more CommandGroups and CommandItems here as needed */}
      </CommandList>
    </CommandDialog>
  );
}
