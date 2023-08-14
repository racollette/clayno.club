"use client";

import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Badge } from "~/@/components/ui/badge";
import { Checkbox } from "~/@/components/ui/checkbox";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "~/@/components/ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/@/components/ui/dropdown-menu";
import { type SubDAO } from "@prisma/client";
import { getTraitBadgeColor } from "~/utils/colors";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<SubDAO>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="flex flex-row items-center justify-start gap-1">
          <div>Name</div>
          <Button
            variant="ghost"
            className="p-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center">
          {row.original.thumbnail && (
            <div className="relative mr-2 aspect-square w-10 overflow-clip rounded-md md:w-12">
              <Image src={row.original.thumbnail} alt="Thumbnail" fill />
            </div>
          )}
          <div className="flex flex-col justify-start">
            <div className="self-center overflow-hidden text-ellipsis  whitespace-nowrap font-bold">
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
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <div className="flex flex-row items-center justify-start gap-1">
          <div>Type</div>
          <Button
            variant="ghost"
            className="p-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className="self-center">{row.original.type}</div>;
    },
    // cell: (info) => info.row,
  },
  {
    accessorKey: "requirements",
    header: ({ column }) => {
      return <div>Requirements</div>;
    },
    cell: ({ row }) => {
      const { requirements } = row?.original;
      return (
        <div className="flex flex-row gap-1 self-center">
          {requirements?.split("_").map((requirement, index) => (
            <div
              key={index}
              className={`rounded-md px-2 py-1 text-sm font-semibold ${getTraitBadgeColor(
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
    accessorKey: "uniqueAddresses",
    header: ({ column }) => {
      return (
        <div className="flex flex-row items-center justify-start gap-1">
          <div>Unique Addresses</div>
          <Button
            variant="ghost"
            className="p-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const { uniqueAddresses } = row?.original;
      return <div className="self-center">{uniqueAddresses}</div>;
    },
  },
  {
    accessorKey: "verifiedAddresses",
    header: ({ column }) => {
      return (
        <div className="flex flex-row items-center justify-start gap-1">
          <div>Verified</div>
          <Button
            variant="ghost"
            className="p-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const { uniqueAddresses } = row?.original;
      const { verifiedAddresses } = row?.original;
      const verifiedPercentage =
        uniqueAddresses &&
        verifiedAddresses &&
        Math.ceil((verifiedAddresses / uniqueAddresses) * 100);
      return (
        <div className="self-center">
          {verifiedPercentage}%
          <span className="ml-1 text-zinc-500">({verifiedAddresses})</span>
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
  // {
  //   accessorKey: "description",
  //   header: () => <div className="text-right">Description</div>,
  // cell: ({ row }) => {
  //   // const amount = parseFloat(row.getValue("amount"));
  //   // const formatted = new Intl.NumberFormat("en-US", {
  //   //   style: "currency",
  //   //   currency: "USD",
  //   // }).format(amount);
  //   return <div className="text-right font-medium">{formatted}</div>;
  // },
  // },
  // {
  //   accessorKey: "status",
  //   header: () => <div className="text-right">Status</div>,
  // },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const payment = row.original;
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             onClick={() => navigator.clipboard.writeText(payment.id)}
  //           >
  //             Copy payment ID
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View customer</DropdownMenuItem>
  //           <DropdownMenuItem>View payment details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
];
