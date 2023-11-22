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

const Holders = () => {
  const [filterTraits, setFilterTraits] = useState<FilterTraits>(initalTraits);
  // const [tableData, setTableData] = useState<any>([]);
  const { data: tribes } = api.subdao.getAllSubDAOs.useQuery();
  const { data: holders, isLoading } =
    api.stats.getDinoHoldersByTrait.useQuery(filterTraits);

  const { data: ccHolders } =
    api.stats.getDinoHoldersByCount.useQuery(filterTraits);

  console.log(ccHolders);

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

          {holders && (
            <HoldersDataTable
              data={
                filterTraits.tribeId === "cll09ow4e0000gq6epo4499y3"
                  ? ccHolders
                  : holders
              }
            />
          )}
        </section>
      </Layout>
    </>
  );
};

export default Holders;
