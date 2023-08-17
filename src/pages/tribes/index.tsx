import Layout from "~/components/Layout";
import DataTable from "./data-table";
import { api } from "~/utils/api";
import Image from "next/image";
import Head from "next/head";
import { ColumnDef } from "@tanstack/react-table";
import { SubDAO } from "@prisma/client";
import { ArrowUpDown } from "lucide-react";
import { getTraitBadgeColor } from "~/utils/colors";

export default function TribesPage() {
  const { data, isLoading } = api.subdao.getAllSubDAOs.useQuery();

  return (
    <>
      <Head>
        <title>DinoHerd | Tribes</title>
        <meta name="description" content="Claynosaurz Herd Showcase" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <section className="container relative m-4 aspect-[7/2] w-full overflow-clip">
          <Image
            src="/images/tribes_banner.png"
            alt="Tribes"
            fill
            quality={100}
            className="rounded-lg"
          />
          <div className="absolute left-0 top-0 h-full items-start justify-end md:flex md:w-1/3">
            <div className="m-2 flex max-w-lg flex-col gap-4 rounded-xl bg-black/70 p-2 text-white hover:bg-black/30 md:m-4 md:p-8">
              <h2 className="text-md font-extrabold text-white md:text-2xl">
                <span className="text-[hsl(280,100%,70%)]">Tribes</span>
              </h2>
              <div className="md:text-md hidden text-sm md:block">
                <p className="text-md pb-2 font-semibold">
                  Tribes are SubDAOs (or Sub-Communities) within the world of
                  Claynotopia!
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="container mx-auto px-0 py-2 pb-24">
          {data && <DataTable columns={columns} data={data} />}
          {/* <div>Hello</div> */}
        </section>
      </Layout>
    </>
  );
}

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
];
