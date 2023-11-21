import Head from "next/head";
import { Fragment, use, useEffect, useState } from "react";
import Layout from "~/components/Layout";
import { useUser } from "~/hooks/useUser";
import { api } from "~/utils/api";
import { Item } from "~/components/Item";
import { type Dino, type Wallet } from "@prisma/client";
import { sortByRarity, type Character } from "~/utils/sort";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/@/components/ui/select";
6;
import { sortByAttribute } from "~/utils/sort";
import { useRouter } from "next/router";
import { getQueryString } from "~/utils/routes";
import { useFetchUserWallets } from "~/hooks/useFetchUserWallets";

const Inventory = () => {
  // const { user } = useUser();
  const router = useRouter();
  const { account } = router.query;
  const { wallets } = useFetchUserWallets(account);

  const [originalSpecies, setOriginalSpecies] = useState<Character[]>([]);
  const [sagaSpecies, setSagaSpecies] = useState<Character[]>([]);
  const [selectedAttribute, setSelectedAttribute] = useState("");

  const { data: holders, isLoading } = api.inventory.getUserItems.useQuery({
    wallets: wallets,
  });

  let dinos = holders?.[0]?.mints;
  let clay = holders?.[0]?.clay;
  let claymakers = holders?.[0]?.claymakers;
  let consumables = holders?.[0]?.consumables;

  if (holders) {
    for (let i = 1; i < holders.length; i++) {
      if (holders[i] && holders?.[i]?.mints) {
        dinos = dinos?.concat(holders?.[i]?.mints ?? []);
        claymakers = claymakers?.concat(holders?.[i]?.claymakers ?? []);
        clay = clay?.concat(holders?.[i]?.clay ?? []);
        consumables = consumables?.concat(holders?.[i]?.consumables ?? []);
      }
    }
  }

  useEffect(() => {
    const originalSpecies = dinos?.filter(
      (dino) =>
        dino?.attributes?.species !== "Spino" &&
        dino?.attributes?.species !== "Para"
    );

    setOriginalSpecies(originalSpecies ?? []);

    const sagaSpecies = dinos?.filter(
      (dino) =>
        dino?.attributes?.species === "Spino" ||
        dino?.attributes?.species === "Para"
    );
    setSagaSpecies(sagaSpecies ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleSort = (attribute: string) => {
    setSelectedAttribute(attribute);
    if (attribute === "rarity") {
      setOriginalSpecies(sortByRarity([...originalSpecies]));
      setSagaSpecies(sortByRarity([...sagaSpecies]));
    }

    const originalSorted = sortByAttribute([...originalSpecies], attribute);
    setOriginalSpecies(originalSorted);

    const sagaSorted = sortByAttribute([...sagaSpecies], attribute);
    setSagaSpecies(sagaSorted);
  };

  return (
    <>
      <Head>
        <title>DinoHerd | Inventory</title>
      </Head>
      <Layout>
        <section className="flex flex-col items-center justify-center gap-y-8 p-2 md:container">
          <div className="font-clayno text-4xl">Inventory</div>
          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-row justify-between">
              <div className="font-clayno text-2xl text-white">
                Claynosaurz {`(${originalSpecies?.length})`}
              </div>
              <div>
                <Select onValueChange={(v) => handleSort(v)}>
                  <SelectTrigger className="w-[180px] bg-black font-clayno text-sm text-white">
                    <SelectValue placeholder="Rarity" />
                  </SelectTrigger>
                  <SelectContent className="bg-black font-clayno text-sm text-white">
                    <SelectItem value="rarity">Rarity</SelectItem>
                    <SelectItem value="species">Species</SelectItem>
                    <SelectItem value="skin">Skin</SelectItem>
                    <SelectItem value="color">Color</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mb-8 flex flex-row flex-wrap gap-2">
              {originalSpecies?.map((dino: any) => (
                <div key={dino.mint}>
                  <Item id={dino.mint} item={dino} />
                </div>
              ))}
            </div>
            <div className="font-clayno text-2xl text-white">
              Call of Saga {`(${sagaSpecies?.length})`}
            </div>
            <div className="mb-8 flex flex-row flex-wrap gap-2">
              {sagaSpecies?.map((dino: any) => (
                <div key={dino.mint}>
                  <Item id={dino.mint} item={dino} />
                </div>
              ))}
            </div>
            <div className="font-clayno text-2xl text-white">
              Clay {`(${clay?.length})`}
            </div>
            <div className="mb-8 flex flex-row flex-wrap gap-2">
              {/* Grouping clays by color */}
              {clay && (
                <>
                  {Object.keys(groupByColor(clay)).map((color) => {
                    const firstClay = groupByColor(clay ?? [])[color][0];
                    const colorCount = groupByColor(clay ?? [])[color].length;
                    return (
                      <div
                        key={color}
                        className="relative flex flex-row flex-wrap gap-2"
                      >
                        <Item id={color} item={firstClay} />
                        <p className="absolute left-2 top-2 font-clayno text-2xl text-white">
                          {colorCount}
                        </p>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
            <div className="font-clayno text-2xl text-white">
              Claymakers {`(${claymakers?.length})`}
            </div>
            <div className="mb-8 flex flex-row flex-wrap gap-2">
              {/* Grouping clays by color */}
              {claymakers && (
                <>
                  {Object.keys(groupByEdition(claymakers)).map((edition) => {
                    if (edition === "First" || edition === "Limited") {
                      const firstClaymaker = groupByEdition(claymakers ?? [])[
                        edition
                      ][0];
                      const editionCount = groupByEdition(claymakers ?? [])[
                        edition
                      ].length;
                      return (
                        <div
                          key={edition}
                          className="relative order-first flex flex-row flex-wrap gap-2"
                        >
                          <Item id={edition} item={firstClaymaker} />
                          <p className="absolute left-2 top-2 font-clayno text-2xl text-white">
                            {editionCount}
                          </p>
                        </div>
                      );
                    }

                    return (
                      <>
                        {groupByEdition(claymakers ?? [])["Deluxe"].map(
                          (claymaker: any) => (
                            <div key={claymaker.mint} className="relative">
                              <Item id={claymaker.mint} item={claymaker} />
                              <p className="front-clayno absolute bottom-2 right-2 text-xl text-white">
                                {claymaker.charges}/5
                              </p>
                            </div>
                          )
                        )}
                      </>
                    );
                  })}
                </>
              )}
            </div>
            <div className="font-clayno text-2xl text-white">
              Consumables {`(${consumables?.length})`}
            </div>
            <div className="mb-8 flex flex-row flex-wrap gap-2">
              {consumables && (
                <>
                  {Object.keys(groupBySymbol(consumables)).map((symbol) => {
                    if (symbol !== "ART") {
                      const firstConsumable = groupBySymbol(consumables ?? [])[
                        symbol
                      ][0];
                      const symbolCount = groupBySymbol(consumables ?? [])[
                        symbol
                      ].length;
                      return (
                        <div
                          key={symbol}
                          className="relative flex flex-row flex-wrap gap-2"
                        >
                          <Item id={symbol} item={firstConsumable} />
                          <p className="absolute left-2 top-2 font-clayno text-2xl text-white">
                            {symbolCount}
                          </p>
                        </div>
                      );
                    }

                    return (
                      <>
                        {groupBySymbol(consumables ?? [])["ART"].map(
                          (artifact: any) => (
                            <div key={artifact.mint} className="relative">
                              <Item id={artifact.mint} item={artifact} />
                            </div>
                          )
                        )}
                      </>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Inventory;

function groupByColor(items: any[]): Record<string, any> {
  return items.reduce((acc: Record<string, any>, item: any) => {
    const color = item.color;
    if (!acc[color]) {
      acc[color] = [];
    }
    acc[color].push(item);
    return acc;
  }, {});
}

function groupByEdition(items: any[]): Record<string, any> {
  return items.reduce((acc: Record<string, any>, item: any) => {
    const edition = item.edition;
    if (!acc[edition]) {
      acc[edition] = [];
    }
    acc[edition].push(item);
    return acc;
  }, {});
}

function groupBySymbol(items: any[]): Record<string, any> {
  return items.reduce((acc: Record<string, any>, item: any) => {
    const symbol = item.symbol;
    if (!acc[symbol]) {
      acc[symbol] = [];
    }
    acc[symbol].push(item);
    return acc;
  }, {});
}
