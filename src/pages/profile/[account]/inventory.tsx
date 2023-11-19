import Head from "next/head";
import { Fragment } from "react";
import Layout from "~/components/Layout";
import { useUser } from "~/hooks/useUser";
import { api } from "~/utils/api";
import { Item } from "~/components/Item";
import { type Wallet } from "@prisma/client";

const Inventory = () => {
  const { user } = useUser();
  const wallets = user?.wallets.map((wallet: Wallet) => wallet.address) ?? [];
  const { data: holders } = api.inventory.getUserItems.useQuery({
    wallets: wallets,
  });

  console.log(holders);

  //   const { data: clays } = api.inventory.getUserItems.useQuery({
  //     wallets: wallets,
  //   });

  // combine holders array into single object
  // const holders = holdersArr.reduce((acc: any, holder: any) => {
  //   const holderAddress = holder.address;
  //   if (!acc[holderAddress]) {

  let dinos = holders?.[0]?.mints;
  let clay = holders?.[0]?.clay;
  let claymakers = holders?.[0]?.claymakers;

  if (holders) {
    for (let i = 1; i < holders.length; i++) {
      if (holders[i] && holders?.[i]?.mints) {
        dinos = dinos?.concat(holders?.[i]?.mints ?? []);
        claymakers = claymakers?.concat(holders?.[i]?.claymakers ?? []);
        clay = clay?.concat(holders?.[i]?.clay ?? []);
      }
    }
  }

  const OG = dinos?.filter(
    (dino) =>
      dino?.attributes?.species !== "Spino" &&
      dino?.attributes?.species !== "Para"
  );

  const saga = dinos?.filter(
    (dino) =>
      dino?.attributes?.species === "Spino" ||
      dino?.attributes?.species === "Para"
  );

  console.log(dinos);

  return (
    <>
      <Head>
        <title>DinoHerd | Inventory</title>
      </Head>
      <Layout>
        <section className="container flex flex-col items-center justify-center gap-y-8">
          <div className="font-claynoShadow text-2xl">Inventory</div>
          <div className="flex w-full flex-col gap-6">
            <div className="flex flex-row flex-wrap gap-2">
              {OG?.map((dino: any) => (
                <div key={dino.mint}>
                  <Item id={dino.mint} item={dino} />
                </div>
              ))}
            </div>
            <div className="flex flex-row flex-wrap gap-2">
              {saga?.map((dino: any) => (
                <div key={dino.mint}>
                  <Item id={dino.mint} item={dino} />
                </div>
              ))}
            </div>
            <div className="flex flex-row flex-wrap gap-2">
              {/* Grouping clays by color */}
              {clay && (
                <>
                  {Object.keys(groupByColor(clay)).map((color, idx) => {
                    const firstClay = groupByColor(clay ?? [])[color][0];
                    const colorCount = groupByColor(clay ?? [])[color].length;
                    return (
                      <div
                        key={idx}
                        className="relative flex flex-row flex-wrap gap-2"
                      >
                        <Item id={color} item={firstClay} />
                        <p className="absolute left-2 top-2 font-clayno text-2xl text-white">
                          {colorCount}
                        </p>

                        {/* {groupByColor(clay ?? [])[color].map((clay: any) => (
                        <div key={clay.mint}>
                          <Item id={clay.mint} item={clay} />
                        </div>
                      ))} */}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
            <div className="flex flex-row flex-wrap gap-2">
              {/* Grouping clays by color */}
              {claymakers && (
                <>
                  {Object.keys(groupByEdition(claymakers)).map(
                    (edition, idx) => {
                      if (edition === "First" || edition === "Limited") {
                        const firstClaymaker = groupByEdition(claymakers ?? [])[
                          edition
                        ][0];
                        const editionCount = groupByEdition(claymakers ?? [])[
                          edition
                        ].length;
                        return (
                          <div
                            key={idx}
                            className="relative order-first flex flex-row flex-wrap gap-2"
                          >
                            <Item id={edition} item={firstClaymaker} />
                            <p className="absolute left-2 top-2 font-clayno text-2xl text-white">
                              {editionCount}
                            </p>

                            {/* {groupByColor(clay ?? [])[color].map((clay: any) => (
                        <div key={clay.mint}>
                          <Item id={clay.mint} item={clay} />
                        </div>
                      ))} */}
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
                    }
                  )}
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
    console.log(acc);
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
