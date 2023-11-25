import Head from "next/head";
import { useState } from "react";
import HoldersDataTable from "~/components/HoldersDataTable";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/@/components/ui/select";
import { CLASSES, SKINS, COLORS, SPECIES } from "~/utils/constants";
import { extractProfileFromUser } from "~/utils/wallet";

type FilterTraits = {
  species: string;
  skin: string;
  color: string;
  class: string;
  tribeId: string;

  [key: string]: string;
};

const initalTraits: FilterTraits = {
  species: "all",
  skin: "all",
  color: "all",
  class: "all",
  tribeId: "all",
};

type Owner = {
  userId: string | null;
  username: string | null;
  userHandle: string | null;
  userPFP: string | null;
  wallets: string[];
};

const Holders = () => {
  const [filterTraits, setFilterTraits] = useState<FilterTraits>(initalTraits);
  // const [tableData, setTableData] = useState<any>([]);
  const { data: tribes } = api.subdao.getAllSubDAOs.useQuery();
  const { data: holders, isLoading } =
    api.stats.getDinoHoldersByTrait.useQuery(filterTraits);

  const { data: ccHolders } =
    api.stats.getDinoHoldersByCount.useQuery(filterTraits);

  const { data: users } = api.binding.getAllUsers.useQuery();

  const tableType =
    filterTraits.tribeId === "cll09ow4e0000gq6epo4499y3" ? ccHolders : holders;
  const tableData = tableType?.map((holder) => {
    const user = users?.find((user) =>
      user.wallets.some((wallet) => wallet.address === holder.address)
    );

    let owner: Owner = {
      userId: null,
      username: null,
      userHandle: null,
      userPFP: null,
      wallets: [],
    };

    if (user) {
      const { userId, username, userHandle, userPFP } =
        extractProfileFromUser(user);
      owner = {
        userId,
        username,
        userHandle,
        userPFP,
        wallets: user.wallets.map((wallet) => wallet.address),
      };
    }

    return {
      ...holder,
      owner,
    };
  });

  const updatedTableData = tableData?.reduce(
    (
      accumulator: {
        owner: Owner;
        address: string | null;
        og: number;
        saga: number;
        clay: number;
        claymakers: number;
      }[],
      holder: {
        owner: Owner;
        address: string | null;
        og: number;
        saga: number;
        clay: number;
        claymakers: number;
      }
    ) => {
      if (!holder.owner.userId) return [...accumulator, holder];

      const userIndex = accumulator.findIndex(
        (entry) => entry.owner.userId === holder.owner.userId
      );

      if (userIndex === -1) {
        accumulator.push({
          ...holder,
          owner: {
            ...holder.owner,
            wallets: [holder.address ?? ""],
          },
        });
      } else {
        const existingEntry = accumulator[userIndex];
        if (
          existingEntry &&
          !existingEntry?.owner.wallets.includes(holder.address ?? "")
        ) {
          existingEntry.og += holder.og;
          existingEntry.saga += holder.saga;
          existingEntry.clay += holder.clay;
          existingEntry.claymakers += holder.claymakers;
          existingEntry.owner.wallets.push(holder.address ?? "");
        }
      }

      return accumulator;
    },
    []
  );

  console.log(updatedTableData);

  const handleSetFilters = (filter: string, value: string) => {
    console.log(value);
    setFilterTraits((prevState) => ({
      ...prevState,
      [filter]: value,
    }));
  };

  return (
    <>
      <Head>
        <title>DinoHerd | Holders</title>
      </Head>
      <Layout>
        <section className="flex w-full flex-col items-center justify-center gap-12 overflow-hidden py-4 font-clayno md:px-4 md:py-8">
          <div className="flex flex-row gap-2">
            <Select onValueChange={(v) => handleSetFilters("skin", v)}>
              <SelectTrigger className="w-[180px] bg-black font-clayno text-sm text-white">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-black font-clayno text-sm text-white">
                <SelectItem value="all">All</SelectItem>
                {SKINS.map((skin) => (
                  <SelectItem key={skin} value={skin.toLowerCase()}>
                    {skin}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={(v) => handleSetFilters("color", v)}>
              <SelectTrigger className="w-[180px] bg-black font-clayno text-sm text-white">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-black font-clayno text-sm text-white">
                <SelectItem value="all">All</SelectItem>
                {COLORS.map((color) => (
                  <SelectItem key={color} value={color.toLowerCase()}>
                    {color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={(v) => handleSetFilters("species", v)}>
              <SelectTrigger className="w-[180px] bg-black font-clayno text-sm text-white">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-black font-clayno text-sm text-white">
                <SelectItem value="all">All</SelectItem>
                {SPECIES.map((species) => (
                  <SelectItem key={species} value={species.toLowerCase()}>
                    {species}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={(v) => handleSetFilters("tribeId", v)}>
              <SelectTrigger className="w-[180px] bg-black font-clayno text-sm text-white">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-black font-clayno text-sm text-white">
                <SelectItem value="all">All</SelectItem>
                {tribes?.map((tribe) => (
                  <SelectItem key={tribe.id} value={tribe.id}>
                    {tribe.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {holders && <HoldersDataTable data={updatedTableData} />}
        </section>
      </Layout>
    </>
  );
};

export default Holders;
