"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useDisplayNav } from "@/components/display-nav";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  let displayNav: string[] | undefined;
  try {
    const context = useDisplayNav();
    displayNav = context.displayNav;
  } catch (error) {
    console.error("Failed to access displayNav context:", error);
    displayNav = undefined;
  }
  // console.log("DisplayNav context value:", displayNav);

  const allTabs = [
    {
      name: "Overview",
      href: "/overview",
      id: "overview",
    },
    {
      name: "Documents",
      href: "/documents",
      id: "documents",
    },
    {
      name: "Favorites",
      href: "/favorites",
      id: "favorites",
    },
  ];

  // Filter tabs based on displayNav state
  const tabs = allTabs.filter((tab) => displayNav?.includes(tab.id) ?? false);

  const handleSelect = (value: string) => {
    window.location.href = value;
  };

  return (
    <>
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="relative h-5 w-5 rounded-full" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="ml-4 align-start" forceMount>
            {tabs.map((tab) => (
              <DropdownMenuItem
                key={tab.href}
                onSelect={() => handleSelect(tab.href)}
              >
                {tab.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="hidden w-full overflow-x-auto px-1 py-2 md:block">
        <div className={cn("flex flex-col", className)} {...props}>
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className={classNames(
                  pathname === tab.href
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "group inline-flex items-center border-b-2 py-5.5 px-1 text-sm font-medium"
                )}
                aria-current={pathname === tab.href ? "page" : undefined}
              >
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
