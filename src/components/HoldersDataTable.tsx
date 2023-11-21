"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/@/components/ui/dropdown-menu";
import { Button } from "~/@/components/ui/button";
import { useRouter } from "next/router";
import { ArrowUpDown } from "lucide-react";
import { getTraitBadgeColor } from "~/utils/colors";
import Image from "next/image";
import { useMemo } from "react";
import { Input } from "~/@/components/ui/input";

interface DataTableProps<TData, TValue> {
  data: any;
}

export default function HoldersDataTable<TData, TValue>({
  data,
}: DataTableProps<TData, TValue>) {
  console.log(data);
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: "holderOwner",
        accessorKey: "holderOwner",
        header: ({ column }) => {
          return (
            <div className="flex cursor-pointer flex-row items-center justify-start gap-1 hover:text-white">
              <div>Holder Address</div>
            </div>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="self-center overflow-hidden whitespace-nowrap font-medium">
              {row.original.holderOwner}
            </div>
          );
        },
      },
      {
        id: "ogCount",
        accessorKey: "ogCount",
        header: ({ column }) => {
          return (
            <div className="flex cursor-pointer flex-row items-center justify-start gap-1 hover:text-white">
              <div>Original</div>
            </div>
          );
        },
        cell: ({ row }) => {
          console.log(row);
          return (
            <div className="self-center font-medium">
              {row.original.ogCount}
            </div>
          );
        },
      },
      {
        id: "sagaCount",
        accessorKey: "sagaCount",
        header: ({ column }) => {
          return (
            <div className="flex cursor-pointer flex-row items-center justify-start gap-1 hover:text-white">
              <div>Sagas</div>
            </div>
          );
        },
        cell: ({ row }) => {
          console.log(row);
          return (
            <div className="self-center font-medium">
              {row.original.sagaCount}
            </div>
          );
        },
      },
    ],
    []
  );

  // const [sorting, setSorting] = React.useState<SortingState>([
  //   { id: "verified", desc: false },
  // ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    // onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      // sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 100,
      },
    },
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md">
        <Table className="border-separate border-spacing-x-0 border-spacing-y-1">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-zinc-500">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() =>
                    router.push(`/inventory/${row.original.holderOwner}`)
                  }
                  className="cursor-pointer rounded-md"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
