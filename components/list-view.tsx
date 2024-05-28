"use client";

import * as React from "react";
import type { Document } from "@prisma/client";
import { DocumentActions } from "./document-actions";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FileTextIcon, Share1Icon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ListViewProps {
  documents: Document[];
  sharedDocuments: string[];
  // onDeleteDocument: (id: string) => void;
  // onCreateDocument: (newDocument: Document) => void;
  // onUpdateDocument: (updatedDocument: Document) => void;
  // onStatusChange: (id: string, newStatus: string) => void;
  // onPriorityChange: (id: string, newPriority: string) => void;
}

function formatDate(date: Date | string): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return format(dateObj, "PP");
}

export const ListView: React.FC<ListViewProps> = ({
  documents,
  sharedDocuments,
  // onDeleteDocument,
  // onCreateDocument,
  // onUpdateDocument,
  // onStatusChange,
  // onPriorityChange,
}) => {
  return (
    <div className="space-y-4">
      {documents.map((document) => (
        <div
          key={document.id}
          className="flex justify-between items-center p-4 border rounded-md transition-colors hover:bg-muted/50"
        >
          <div className="flex">
            <FileTextIcon className="self-center mr-4" />
            <div className="flex flex-col">
              <Link
                href={`/editor/${document.id}`}
                className="text-sm font-medium"
              >
                {document.title}
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <div className="text-sm text-muted-foreground">
                  {formatDate(document.createdAt)}
                </div>
                {document.status && (
                  <Badge variant="secondary">{document.status}</Badge>
                )}
                {document.priority && (
                  <Badge variant="secondary">{document.priority}</Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            {sharedDocuments.includes(document.id) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Share1Icon className="w-4 h-4 mr-2" />
                  </TooltipTrigger>
                  <TooltipContent>Document shared with others</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <DocumentActions
              document={document}
              // onDeleteDocument={onDeleteDocument}
              // onCreateDocument={onCreateDocument}
              // onUpdateDocument={onUpdateDocument}
              // onStatusChange={onStatusChange}
              // onPriorityChange={onPriorityChange}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
