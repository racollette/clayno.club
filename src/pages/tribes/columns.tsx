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
        <div
          className={`flex cursor-pointer flex-row items-center justify-start gap-1 hover:text-white`}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
      return <div className="self-center font-medium">{row.original.type}</div>;
    },
    // cell: (info) => info.row,
  },
  {
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
    accessorKey: "uniqueAddresses",
    header: ({ column }) => {
      return (
        <div
          className={`flex cursor-pointer flex-row items-center justify-start gap-1 hover:text-white`}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
