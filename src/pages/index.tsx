import Head from "next/head";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import TabSelection from "~/components/TabSelection";
import Herd from "~/components/Herd";
import Image from "next/image";
import { useTimeSinceLastUpdate } from "~/hooks/useUpdated";
import { useRouter, useSearchParams } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "~/@/components/ui/radio-group";
import { Label } from "~/@/components/ui/label";
import { Herd as HerdType, Attributes, Dino } from "@prisma/client";
import Link from "next/link";

// const getHerdRarity = (herd: any) => {
//   const total = herd.herd.reduce((sum: number, obj: any) => {
//     if (obj.attributes.species !== "Dactyl") {
//       if (obj.rarity) {
//         return sum + obj.rarity;
//       }
//     }
//     return sum;
//   }, 0);

//   return (total / 6).toFixed(0);
// };

const COLORS = [
  "Charcoal",
  "Mist",
  "Aqua",
  "Desert",
  "Volcanic",
  "Tropic",
  "Amethyst",
  "Spring",
];
const SKINS = [
  "Apres",
  "Mirage",
  "Jurassic",
  "Toxic",
  "Coral",
  "Elektra",
  "Cristalline",
  "Oceania",
  "Savanna",
  "Amazonia",
];
const BACKGROUNDS = ["Salmon", "Lavender", "Peach", "Sky", "Mint", "Dune"];

const TIERS = ["Legendary", "Epic", "Rare"];

// Custom hook to filter herds
function useFilteredHerds(
  allHerds:
    | (HerdType & {
        herd: (Dino & {
          attributes: Attributes | null;
        })[];
      })[]
    | undefined,
  color: string | null,
  skin: string | null,
  background: string | null,
  tier: string | null
) {
  return allHerds?.filter((herd) => {
    const herdMatchesLower = herd.matches.toLowerCase();
    const colorFilter =
      !color || color === "all" || herdMatchesLower.includes(color);
    const skinFilter =
      !skin || skin === "all" || herdMatchesLower.includes(skin);
    const backgroundFilter =
      !background ||
      background === "all" ||
      herdMatchesLower.includes(background);
    const tierValue =
      tier === "legendary" ? 1 : tier === "epic" ? 2 : tier === "rare" ? 3 : 0;
    const tierFilter = !tier || tier === "all" || herd.tier === tierValue;

    return colorFilter && skinFilter && backgroundFilter && tierFilter;
  });
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // const showDactyl = searchParams.get("dactyl");
  // const showSaga = searchParams.get("saga");
  // const showPFP = searchParams.get("pfp");

  const color = searchParams.get("color");
  const skin = searchParams.get("skin");
  const background = searchParams.get("background");
  const tier = searchParams.get("tier");

  const [showDactyl, setShowDactyl] = useState(false);
  const [showSaga, setShowSaga] = useState(false);
  const [showPFP, setShowPFP] = useState(false);

  const { data: allHerds, isLoading: allHerdsLoading } =
    api.herd.getAllHerds.useQuery();
  const [filteredHerds, setFilteredHerds] = useState(allHerds);

  useEffect(() => {
    setFilteredHerds(useFilteredHerds(allHerds, color, skin, background, tier));
  }, [color, background, skin, tier]);

  const toggleDactyl = (newToggleState: boolean) => {
    setShowDactyl(newToggleState);
  };

  const toggleSaga = (newToggleState: boolean) => {
    setShowSaga(newToggleState);
  };

  const togglePFP = (newToggleState: boolean) => {
    setShowPFP(newToggleState);
  };

  // const herds = api.useQueries((t) =>
  //   [1, 2, 3].map((tier) => t.herd.getHerdTier({ tier: tier }))
  // );
  // const isLoading = herds.some((queryResult) => queryResult.isLoading);

  const lastUpdated = useTimeSinceLastUpdate("herds");

  return (
    <>
      <Head>
        <title>DinoHerd | Home</title>
        <meta name="description" content="Claynosaurz Herd Showcase" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative flex min-h-screen flex-col items-center justify-center bg-black">
        {allHerdsLoading ? (
          <div className="relative mb-24 aspect-square w-1/2 overflow-clip rounded-full text-white md:w-1/4">
            <Image
              src="/gifs/TTT.gif"
              alt="Loading"
              fill
              className="rounded-full"
            />
          </div>
        ) : (
          <div className="flex w-full flex-col items-center justify-center py-2 md:px-4">
            <div className="flex w-full flex-col flex-wrap items-center justify-center p-2">
              <div className="relative aspect-video w-full p-4 md:w-3/5">
                <Image
                  className="rounded-lg"
                  src="https://pbs.twimg.com/media/FqOrzzRXoAQ3yjV?format=jpg"
                  alt="Claynosaurz"
                  quality={100}
                  fill
                />
                <div className="absolute right-0 top-0 hidden h-full w-3/5 items-start justify-end md:flex">
                  <div className="m-4 flex max-w-lg flex-col gap-4 rounded-xl bg-black/70 p-8 text-white hover:bg-black/30">
                    <h2 className="text-xl font-extrabold text-white md:text-2xl">
                      Dino{" "}
                      <span className="text-[hsl(192,100%,70%)]">Herds</span>
                    </h2>
                    <div className="md:text-md text-sm">
                      <p className="pb-2">
                        A herd is a collection containing one of each of the six
                        original Claynosaurz species.
                      </p>
                      <p>The more matching traits the better!</p>
                    </div>
                  </div>
                </div>
                <div className="absolute left-0 top-0 flex h-full w-full items-start justify-end md:hidden">
                  <div className="m-5 flex max-w-lg flex-col rounded-xl bg-black/70 px-4 py-3 text-white hover:bg-black/30">
                    <h2 className="text-xl font-extrabold text-white">
                      Dino{" "}
                      <span className="text-[hsl(280,100%,70%)]">Herds</span>
                    </h2>
                  </div>
                </div>
                <div className="absolute -bottom-5 -right-0 pt-2 text-right text-xs italic text-zinc-500">
                  {`Updated ${lastUpdated}`}
                </div>
              </div>
            </div>

            <section className="flex flex-col gap-4 p-8 text-white">
              <RadioGroup
                defaultValue="all"
                className="flex items-center justify-center"
                orientation="horizontal"
              >
                <div className="w-20 text-right text-xs font-bold">Skin</div>
                <div className="flex items-center justify-center space-x-2">
                  <Link
                    href={`?skin=all&color=${color}&background=${background}&tier=${tier}`}
                    scroll={false}
                    className="flex items-center justify-center"
                  >
                    <RadioGroupItem
                      value={"all"}
                      className="h-5 w-5 self-center bg-neutral-700 text-white"
                    />
                  </Link>

                  <Label className="text-xs font-semibold">All</Label>
                  {SKINS.map((skin) => (
                    <>
                      <Link
                        key={skin}
                        href={`?skin=${skin.toLowerCase()}&color=${color}&background=${background}&tier=${tier}`}
                        scroll={false}
                        className="flex items-center justify-center"
                      >
                        <RadioGroupItem
                          value={skin}
                          className="h-5 w-5 self-center bg-neutral-700 p-1 text-white"
                        />
                      </Link>

                      <Label className="text-xs font-semibold">{skin}</Label>
                    </>
                  ))}
                </div>
              </RadioGroup>

              <RadioGroup
                defaultValue="all"
                className="flex items-center justify-center"
                orientation="horizontal"
              >
                <div className="w-20 text-right text-xs font-bold">Color</div>
                <div className="flex items-center justify-center space-x-2">
                  <Link
                    href={`?skin=${skin}&color=all&background=${background}&tier=${tier}`}
                    scroll={false}
                    className="flex items-center justify-center"
                  >
                    <RadioGroupItem
                      value={"all"}
                      className="h-5 w-5 self-center bg-neutral-700 text-white"
                    />
                  </Link>

                  <Label className="text-xs font-semibold">All</Label>
                  {COLORS.map((color) => (
                    <>
                      <Link
                        key={color}
                        href={`?skin=${skin}&color=${color.toLowerCase()}&background=${background}&tier=${tier}`}
                        scroll={false}
                        className="flex items-center justify-center"
                      >
                        <RadioGroupItem
                          value={color}
                          className="h-5 w-5 self-center bg-neutral-700 p-1 text-white"
                        />
                      </Link>

                      <Label className="text-xs font-semibold">{color}</Label>
                    </>
                  ))}
                </div>
              </RadioGroup>

              <RadioGroup
                defaultValue="all"
                className="flex items-center justify-center"
                orientation="horizontal"
              >
                <div className="w-20 text-right text-xs font-bold">
                  Background
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Link
                    href={`?skin=${skin}&color=${color}&background=all&tier=${tier}`}
                    scroll={false}
                    className="flex items-center justify-center"
                  >
                    <RadioGroupItem
                      value={"all"}
                      className="h-5 w-5 self-center bg-neutral-700 text-white"
                    />
                  </Link>

                  <Label className="text-xs font-semibold">All</Label>
                  {BACKGROUNDS.map((background) => (
                    <>
                      <Link
                        key={background}
                        href={`?skin=${skin}&color=${color}&background=${background.toLowerCase()}&tier=${tier}`}
                        scroll={false}
                        className="flex items-center justify-center"
                      >
                        <RadioGroupItem
                          value={background}
                          className="h-5 w-5 self-center bg-neutral-700 p-1 text-white"
                        />
                      </Link>

                      <Label className="text-xs font-semibold">
                        {background}
                      </Label>
                    </>
                  ))}
                </div>
              </RadioGroup>

              <RadioGroup
                defaultValue="all"
                className="flex items-center justify-center"
                orientation="horizontal"
              >
                <div className="w-20 text-right text-xs font-bold">Tier</div>
                <div className="flex items-center justify-center space-x-2">
                  <Link
                    href={`?skin=${skin}&color=${color}&background=${background}&tier=all`}
                    scroll={false}
                    className="flex items-center justify-center"
                  >
                    <RadioGroupItem
                      value={"all"}
                      className="h-5 w-5 self-center bg-neutral-700 text-white"
                    />
                  </Link>

                  <Label className="text-xs font-semibold">All</Label>
                  {TIERS.map((tier) => (
                    <>
                      <Link
                        key={tier}
                        href={`?skin=${skin}&color=${color}&background=${background}&tier=${tier.toLowerCase()}`}
                        scroll={false}
                        className="flex items-center justify-center"
                      >
                        <RadioGroupItem
                          value={tier}
                          className="h-5 w-5 self-center bg-neutral-700 p-1 text-white"
                        />
                      </Link>

                      <Label className="text-xs font-semibold">{tier}</Label>
                    </>
                  ))}
                </div>
              </RadioGroup>
            </section>

            <section className="w-full md:w-3/4 lg:w-3/5 xl:w-1/2 2xl:w-2/5">
              <TabSelection
                labels={["3 Trait", "2 Trait", "1 Trait"]}
                counts={[
                  // herds[0]?.data?.length ?? 0,
                  // herds[1]?.data?.length ?? 0,
                  // herds[2]?.data?.length ?? 0,
                  0, 0, 0,
                ]}
                showDactyl={showDactyl}
                showSaga={showSaga}
                showPFP={showPFP}
                toggleDactyl={toggleDactyl}
                toggleSaga={toggleSaga}
                togglePFP={togglePFP}
              >
                {/* {herds.map((tier, index) => ( */}
                <div className="flex flex-col items-center gap-2">
                  {/* {tier.data &&
                      tier.data?.map((herd) => (
                        <Herd
                          key={herd.id}
                          herd={herd}
                          showDactyl={showDactyl}
                          showSaga={showSaga}
                          showOwner={true}
                          showPFP={showPFP}
                        />
                      ))} */}
                  {filteredHerds?.map((herd) => (
                    <Herd
                      key={herd.id}
                      herd={herd}
                      showDactyl={showDactyl}
                      showSaga={showSaga}
                      showOwner={true}
                      showPFP={showPFP}
                    />
                  ))}
                </div>
                {/* ))} */}
              </TabSelection>
            </section>
          </div>
        )}
      </main>
    </>
  );
}

//   const { data: secretMessage } = api.herd.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );
