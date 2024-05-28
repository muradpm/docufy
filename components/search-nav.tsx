"use client";

import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { CardContent, Card } from "@/components/ui/card";
import Link from "next/link";
import { searchDocuments } from "@/app/actions/search";
import { getCurrentWorkspaceId } from "@/app/actions/workspace";

type SearchResult = {
  id: string;
  title: string;
};

export function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm && session?.user?.id) {
        try {
          const workspaceId = await getCurrentWorkspaceId(session.user.id);
          const data = await searchDocuments(
            searchTerm,
            session.user.id,
            workspaceId
          );
          setSearchResults(data);
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        setSearchResults([]);
      }
    };

    void fetchData();
  }, [searchTerm, session?.user?.id]);

  return (
    <div className="relative">
      <Input
        id="search"
        type="search"
        placeholder="Search documents..."
        aria-label="Search documents"
        className="flex rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 w-full sm:w-64 sm:pr-12"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>

      {searchTerm && (
        <div className="absolute left-0 right-0 z-10 mt-1 rounded-lg overflow-y-auto h-64">
          <Card>
            <CardContent className="p-0">
              {searchResults.length > 0 ? (
                <ul className="list-none m-0 p-0">
                  {searchResults.map((result) => (
                    <li key={result.id} className="border-b last:border-b-0">
                      <Link
                        className="block px-4 py-3 text-sm hover:bg-accent"
                        href={`/editor/${result.id}`}
                      >
                        {result.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-3 text-sm text-gray-700">
                  No results found.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
