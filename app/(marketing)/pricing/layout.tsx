"use client";

import React from "react";
import { CommandMenu } from "@/components/command-menu";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Icons } from "@/components/icons";

interface PricingLayoutProps {
  children: React.ReactNode;
}

const handleLogout = () => {
  void signOut({ callbackUrl: "/" });
};

export default function PricingLayout({ children }: PricingLayoutProps) {
  return (
    <div>
      <div className="sticky top-0 z-50 bg-background">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center space-x-4">
            <Link href="#" className="flex items-center -m-1.5 p-1.5 ">
              <Icons.brand className="h-12 w-12" />
              <span className="ml-2 text-xl font-bold text-black dark:text-white">
                docufy
              </span>
            </Link>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="secondary" onClick={handleLogout}>
              Log out
            </Button>
            <CommandMenu />
          </div>
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
}
