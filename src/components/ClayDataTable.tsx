"use client";

import * as React from "react";
import {
  type ColumnDef,
  flexRender,
  SortingState,
  type VisibilityState,
  type ColumnFiltersState,
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
import Image from "next/image";
import { useMemo } from "react";
import { Input } from "~/@/components/ui/input";
import { handleUserPFPDoesNotExist } from "~/utils/images";

interface DataTableProps<TData, TValue> {
  data: any;
}

export default function HoldersDataTable<TData, TValue>({
  data,
}: DataTableProps<TData, TValue>) {
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: "rank",
        accessorKey: "rank",
        header: ({ column }) => {
          return (
            <div className="flex cursor-pointer flex-row items-center justify-start gap-1 hover:text-white">
              <div>Rank</div>
            </div>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="self-center overflow-hidden whitespace-nowrap font-medium">
              {row.index + 1}
            </div>
          );
        },
      },
      {
        id: "address",
        accessorKey: "address",
        canHide: false,
        header: ({ column }) => {
          return (
            <div className="flex cursor-pointer flex-row items-center justify-start gap-1 hover:text-white">
              <div>Owner</div>
            </div>
          );
        },
        cell: ({ row }) => {
          const truncatedAddress = `${row.original.address.slice(
            0,
            5
          )}...${row.original.address.slice(-5)}`;
          return (
            <>
              {row.original.owner.userPFP ? (
                <div className="flex flex-row items-center justify-start gap-2">
                  <Image
                    src={row.original.owner.userPFP}
                    alt="PFP"
                    width={24}
                    height={24}
                    className="rounded-full"
                    onError={handleUserPFPDoesNotExist}
                  />
                  <p>{row.original.owner.userHandle}</p>
                  <p className="ml-4 hidden md:block">{truncatedAddress}</p>
                </div>
              ) : (
                <div className="flex flex-row overflow-hidden whitespace-nowrap">
                  <p className="block md:hidden">{truncatedAddress}</p>
                  <p className="hidden md:block">{row.original.address}</p>
                </div>
              )}
            </>
          );
        },
      },
      {
        id: "total",
        accessorKey: "total",
        header: ({ column }) => {
          return (
            <div
              className="flex cursor-pointer flex-row items-center justify-start gap-1 hover:text-white"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <div>Total</div>
              <ArrowUpDown className="h-4 w-4" />
            </div>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="self-center font-medium">{row.original.total}</div>
          );
        },
      },
      {
        id: "red",
        accessorKey: "red",
        header: ({ column }) => {
          return (
            <div
              className="flex cursor-pointer flex-row items-center justify-start gap-1 hover:text-white"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <Image
                src="/images/red.png"
                width={20}
                height={20}
                alt="Red"
                className="rounded-md"
              />
              <ArrowUpDown className="h-4 w-4" />
            </div>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="self-center font-medium">{row.original.red}</div>
          );
        },
      },
      {
        id: "green",
        accessorKey: "green",
        header: ({ column }) => {
          return (
            <div
              className="flex cursor-pointer flex-row items-center justify-start gap-1 hover:text-white"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <Image
                src="/images/green.png"
                width={20}
                height={20}
                alt="Green"
                className="rounded-md"
              />
              <ArrowUpDown className="h-4 w-4" />
            </div>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="self-center font-medium">{row.original.green}</div>
          );
        },
      },
      {
        id: "blue",
        accessorKey: "blue",
        header: ({ column }) => {
          return (
            <div
              className="flex cursor-pointer flex-row items-center justify-start gap-1 hover:text-white"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <Image
                src="/images/blue.png"
                width={20}
                height={20}
                alt="Blue"
                className="rounded-md"
              />
              <ArrowUpDown className="h-4 w-4" />
            </div>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="self-center font-medium">{row.original.blue}</div>
          );
        },
      },
      {
        id: "yellow",
        accessorKey: "yellow",
        header: ({ column }) => {
          return (
            <div
              className="flex cursor-pointer flex-row items-center justify-start gap-1 hover:text-white"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <Image
                src="/images/yellow.png"
                width={20}
                height={20}
                alt="Yellow"
                className="rounded-md"
              />
              <ArrowUpDown className="h-4 w-4" />
            </div>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="self-center font-medium">{row.original.yellow}</div>
          );
        },
      },
      {
        id: "white",
        accessorKey: "white",
        header: ({ column }) => {
          return (
            <div
              className="flex cursor-pointer flex-row items-center justify-start gap-1 hover:text-white"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <Image
                src="/images/white.png"
                width={20}
                height={20}
                alt="White"
                className="rounded-md"
              />
              <ArrowUpDown className="h-4 w-4" />
            </div>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="self-center font-medium">{row.original.white}</div>
          );
        },
      },
      {
        id: "black",
        accessorKey: "black",
        header: ({ column }) => {
          return (
            <div
              className="flex cursor-pointer flex-row items-center justify-start gap-1 hover:text-white"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <Image
                src="/images/black.png"
                width={20}
                height={20}
                alt="Black"
                className="rounded-md"
              />
              <ArrowUpDown className="h-4 w-4" />
            </div>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="self-center font-medium">{row.original.black}</div>
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

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
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
    <>
      <div className="flex items-center gap-2 py-4">
        <Input
          placeholder="Search address"
          // value={(table.getColumn("address")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("address")?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-black"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto bg-black">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-black font-clayno text-white"
          >
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
                    window.open(
                      `/inventory/${
                        row.original.owner.username ?? row.original.address
                      }`
                    )
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
          className="bg-black font-clayno text-white"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          className="bg-black font-clayno text-white"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </>
  );
}
