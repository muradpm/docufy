"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import type { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "./document-filters";
import { DataTableBulkActions } from "./data-table-bulk-actions";
import { statuses, priorities } from "./data";

interface WithId {
  id: string;
}

interface DataTableFilterProps<TData extends WithId> {
  table: Table<TData>;
  onMassBulkDocuments: (selectedIds: string[]) => void;
}

export function DataTableFilter<TData extends WithId>({
  table,
  onMassBulkDocuments,
}: DataTableFilterProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          name="filter"
          placeholder="Filter documents..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            <Cross2Icon className="h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableBulkActions
        table={table}
        onMassBulkDocuments={onMassBulkDocuments}
      />
    </div>
  );
}
