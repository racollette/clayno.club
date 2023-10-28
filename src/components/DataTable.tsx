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
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "~/@/components/ui/dropdown-menu";
// import { Button } from "~/@/components/ui/button";
import { SubDAO } from "@prisma/client";
import { useRouter } from "next/router";
import { ArrowUpDown } from "lucide-react";
import { getTraitBadgeColor } from "~/utils/colors";
import Image from "next/image";
import { useMemo } from "react";

interface DataTableProps<TData, TValue> {
  data: SubDAO[];
}

export default function DataTable<TData, TValue>({
  data,
}: DataTableProps<TData, TValue>) {
  const columns = useMemo<ColumnDef<SubDAO>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <div
              className={`flex cursor-pointer flex-row items-center justify-start gap-1 hover:text-white`}
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <div>Name</div>
              <ArrowUpDown className="h-4 w-4" />
            </div>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="flex flex-row items-center">
              {row.original.thumbnail && (
                <div className="relative mr-2 aspect-square w-10 overflow-clip rounded-md md:w-12">
                  <Image src={row.original.thumbnail} alt="" fill />
                </div>
              )}
              <div className="flex flex-col justify-start">
                <div className="self-center overflow-hidden text-ellipsis  whitespace-nowrap font-medium">
                  {row.original.name}
                </div>
                <div className="text-sm text-zinc-500">
                  {row.original.qualifyingCount}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        id: "type",
        accessorKey: "type",
        header: ({ column }) => {
          return (
            <div
              className={`flex cursor-pointer flex-row items-center justify-start gap-1 hover:text-white`}
            >
              <div>Type</div>
            </div>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="self-center font-medium">{row.original.type}</div>
          );
        },
        // cell: (info) => info.row,
      },
      {
        id: "requirements",
        accessorKey: "requirements",
        header: ({ column }) => {
          return (
            <div
              className={`flex cursor-pointer flex-row items-center justify-start gap-1 hover:text-white`}
            >
              <div>Requirements</div>
            </div>
          );
        },
        cell: ({ row }) => {
          const { requirements } = row?.original;
          return (
            <div className="flex flex-row gap-1 self-center">
              {requirements?.split("_").map((requirement, index) => (
                <div
                  key={index}
                  className={`rounded-md px-2 py-1 text-sm font-medium ${getTraitBadgeColor(
                    requirement
                  )}`}
                >
                  {requirement}
                </div>
              ))}
            </div>
          );
        },
      },
      {
        id: "uniqueAddresses",
        accessorKey: "uniqueAddresses",
        header: ({ column }) => {
          return (
            <div
              className={`flex cursor-pointer flex-row items-center justify-start gap-1 hover:text-white`}
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <div>Unique Addresses</div>
              <ArrowUpDown className="h-4 w-4" />
            </div>
          );
        },
        cell: ({ row }) => {
          const { uniqueAddresses, qualifyingCount } = row?.original;
          const ownershipPercentage =
            uniqueAddresses &&
            qualifyingCount &&
            ((uniqueAddresses / qualifyingCount) * 100).toFixed(0);
          return (
            <div className="self-center font-medium">
              {uniqueAddresses}
              <span className="ml-1 font-medium text-zinc-500">{`(${ownershipPercentage}%)`}</span>
            </div>
          );
        },
      },
      {
        id: "dinosPerAddress",
        accessorKey: "qualifyingCount",
        header: ({ column }) => {
          return (
            <div
              className={`flex cursor-pointer flex-row items-center justify-start gap-1 hover:text-white`}
            >
              <div>Dinos per Address</div>
            </div>
          );
        },
        cell: ({ row }) => {
          const { uniqueAddresses, qualifyingCount } = row?.original;
          const NFTPerMember =
            uniqueAddresses &&
            qualifyingCount &&
            (qualifyingCount / uniqueAddresses).toFixed(2);
          return <div className="self-center font-medium">{NFTPerMember}</div>;
        },
      },
      {
        id: "verified",
        accessorKey: "verifiedAddresses",
        header: ({ column }) => {
          return (
            <div
              className={`flex cursor-pointer flex-row items-center justify-start gap-1 hover:text-white`}
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <div>Verified</div>
              <ArrowUpDown className="h-4 w-4" />
            </div>
          );
        },
        cell: ({ row }) => {
          const { uniqueAddresses, verifiedAddresses } = row?.original;
          const verifiedPercentage =
            uniqueAddresses &&
            verifiedAddresses &&
            Math.ceil((verifiedAddresses / uniqueAddresses) * 100);
          return (
            <div className="self-center font-medium">
              {verifiedPercentage}%
              <span className="ml-1 font-medium text-zinc-500">
                ({verifiedAddresses})
              </span>
            </div>
          );
        },
        sortingFn: (rowA, rowB) => {
          const verifiedAddressesA = rowA.original.verifiedAddresses ?? 0;
          const uniqueAddressesA = rowA.original.uniqueAddresses ?? 1;
          const verifiedAddressesB = rowB.original.verifiedAddresses ?? 0;
          const uniqueAddressesB = rowB.original.uniqueAddresses ?? 1;
          const numA = (verifiedAddressesA / uniqueAddressesA) * 100;
          const numB = (verifiedAddressesB / uniqueAddressesB) * 100;
          return numA < numB ? 1 : numA > numB ? -1 : 0;
        },
      },
    ],
    []
  );

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "verified", desc: false },
  ]);
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
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    // onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
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
      {/* <div className="flex items-center py-4"> */}
      {/* <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        /> */}
      {/* <DropdownMenu>
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
        </DropdownMenu> */}
      {/* </div> */}
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
                  onClick={() => router.push(`/tribes/${row.original.acronym}`)}
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
      {/* <div className="flex items-center justify-end space-x-2 py-4">
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
      </div> */}
    </div>
  );
}
