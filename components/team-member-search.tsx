import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import React from "react";

interface UserSearchProps {
  onSearch: (term: string) => void;
}

export function TeamMemberSearch({ onSearch }: UserSearchProps) {
  return (
    <div className="mt-4 relative">
      <div
        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        aria-hidden="true"
      >
        <MagnifyingGlassIcon
          className="h-5 w-5 text-gray-500"
          aria-hidden="true"
        />
      </div>
      <Input
        id="memberSearch"
        name="memberSearch"
        placeholder="Search users..."
        type="search"
        onChange={(e) => onSearch(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
