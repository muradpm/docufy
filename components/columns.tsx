"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { DocumentActions } from "./document-actions";
import { DataTableColumnHeader } from "./data-table-column-header";
import { statuses, priorities } from "./data";
import { format } from "date-fns";
import type { Document } from "@prisma/client";

function formatDate(date: Date | string): string {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return format(date, "PP");
}

export const columns: ColumnDef<Document>[] = [
  // onDeleteDocument: (id: string) => void,
  // onCreateDocument: (newDocument: Document) => void,
  // handleUpdateDocument: (updatedDocument: Document) => void,
  // onStatusChange: (id: string, newStatus: string) => void,
  // onPriorityChange: (id: string, newPriority: string) => void

  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link href={`/editor/${row.original.id}`} className="text-sm font-medium">
        <span className="max-w-[500px] truncate font-medium">
          {row.original.title}
        </span>
      </Link>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span>{formatDate(row.original.createdAt)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span>{formatDate(row.original.updatedAt)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.original.status
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.original.priority
      );

      if (!priority) {
        return null;
      }

      return (
        <div className="flex items-center">
          <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{priority.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    id: "actions",
    cell: (props) => (
      <DocumentActions
        document={props.row.original}
        // onDeleteDocument={onDeleteDocument}
        // onCreateDocument={onCreateDocument}
        // onUpdateDocument={handleUpdateDocument}
        // onStatusChange={(id, newStatus) => {
        //   const updatedDocument = documents.find((doc) => doc.id === id);
        //   if (updatedDocument) {
        //     updatedDocument.status = newStatus;
        //     handleUpdateDocument(updatedDocument);
        //   }
        // }}
        // onPriorityChange={(id, newPriority) => {
        //   const updatedDocument = documents.find((doc) => doc.id === id);
        //   if (updatedDocument) {
        //     updatedDocument.priority = newPriority;
        //     handleUpdateDocument(updatedDocument);
        //   }
        // }}
      />
    ),
  },
];
