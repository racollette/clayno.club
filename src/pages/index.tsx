import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { api } from "~/utils/api";
import { truncateAccount } from "~/utils/addresses";
import TabSelection from "~/components/TabSelection";

const getTraitBadgeColor = (trait: string) => {
  switch (trait) {
    // Colors
    case "Amethyst":
      return "bg-purple-500";
    case "Aqua":
      return "bg-sky-600";
    case "Charcoal":
      return "bg-zinc-700";
    case "Desert":
      return "bg-yellow-500";
    case "Mist":
      return "bg-slate-400";
    case "Spring":
      return "bg-rose-400";
    case "Tropic":
      return "bg-emerald-500";
    case "Volcanic":
      return "bg-red-600";
    // Skins
    case "Toxic":
      return "bg-lime-600";
    case "Jurassic":
      return "bg-green-600";
    case "Mirage":
      return "bg-pink-400";
    case "Amazonia":
      return "bg-teal-600";
    case "Elektra":
      return "bg-indigo-600";
    case "Cristalline":
      return "bg-emerald-600";
    case "Coral":
      return "bg-cyan-600";
    case "Apres":
      return "bg-purple-800";
    case "Savanna":
      return "bg-orange-400";
    case "Oceania":
      return "bg-blue-700";
    // Backgrounds
    case "Peach":
      return "bg-orange-400";
    case "Mint":
      return "bg-emerald-400";
    case "Sky":
      return "bg-sky-400";
    case "Dune":
      return "bg-orange-300";
    case "Lavender":
      return "bg-fuchsia-300";
    case "Salmon":
      return "bg-red-400";
    // Default
    default:
      return "bg-slate-100";
  }
};

const getColor = (matches: string) => {
  const color = matches.split("_")[1];
  switch (color) {
    case "Amethyst":
      return "border-purple-500";
    case "Aqua":
      return "border-sky-600";
    case "Charcoal":
      return "border-zinc-500";
    case "Desert":
      return "border-yellow-500";
    case "Mist":
      return "border-slate-300";
    case "Spring":
      return "border-rose-300";
    case "Tropic":
      return "border-emerald-500";
    case "Volcanic":
      return "border-red-600";
    default:
      return "border-slate-100";
  }
};

const getRarityColor = (rank: number) => {
  if (rank > 6088) return "bg-zinc-500";
  if (rank > 3564) return "bg-emerald-600";
  if (rank > 1531) return "bg-blue-400";
  if (rank > 505) return "bg-purple-600";
  if (rank > 102) return "bg-amber-500";
  return "bg-rose-600";
};

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

// const getBackgroundColor = (matches: string) => {
//   const color = matches.split("_")[2];
//   switch (color) {
//     case "Sky":
//       return "bg-blue-300";
//     case "Mint":
//       return "bg-teal-100";
//     case "Lavender":
//       return "bg-fuchsia-400";
//     case "Dune":
//       return "bg-orange-300";
//     case "Peach":
//       return "bg-rose-300";
//     case "Desert":
//       return "bg-amber-200";
//     default:
//       return "";
//   }
// };

export default function Home() {
  const herds = [
    api.example.getT1Herds.useQuery(),
    api.example.getT2Herds.useQuery(),
    api.example.getT3Herds.useQuery(),
    api.example.getT4Herds.useQuery(),
  ];

  return (
    <>
      <Head>
        <title>Dino Herds</title>
        <meta name="description" content="Claynosaurz Herd Showcase" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <div className="container flex flex-col items-center justify-center py-4 md:px-4 md:py-8 ">
          <div className="flex flex-row flex-wrap align-middle">
            <div className="relative p-4">
              <img
                src="https://pbs.twimg.com/media/FqOrzzRXoAQ3yjV?format=jpg"
                alt="Claynosaurz"
                className="h-auto w-full rounded-lg"
              />
              <div className="absolute left-0 top-0 hidden h-full w-full items-start justify-end md:flex">
                <div className="m-6 flex max-w-lg flex-col gap-4 rounded-xl bg-black/70 p-8 text-white hover:bg-black/30">
                  <h2 className="text-xl font-extrabold text-white md:text-3xl">
                    Dino <span className="text-[hsl(280,100%,70%)]">Herds</span>
                  </h2>
                  <div className="text-sm md:text-lg">
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
                    Dino <span className="text-[hsl(280,100%,70%)]">Herds</span>
                  </h2>
                </div>
              </div>
            </div>
          </div>
          <TabSelection
            labels={["3 Trait", "2 Trait", "1 Trait", "0 Trait"]}
            counts={[
              herds[0]?.data?.length ?? 0,
              herds[1]?.data?.length ?? 0,
              herds[2]?.data?.length ?? 0,
              herds[3]?.data?.length ?? 0,
            ]}
          >
            {herds.map((tier) => (
              <div className="flex flex-col items-center gap-2">
                {tier.data &&
                  tier.data?.map((herd) => (
                    <div key={herd.id} className="mb-4 flex flex-col">
                      <div
                        className={`mb-1 flex flex-wrap items-center justify-between rounded-md border-2 bg-white/10  ${getColor(
                          herd.matches
                        )}`}
                      >
                        {herd.tier !== 4 && (
                          <div className="m-2 flex flex-row">
                            {herd.matches.split("_").map((trait, index) => (
                              <div
                                className={`m-1 rounded-md px-2 py-1 text-xs font-extrabold text-white ${getTraitBadgeColor(
                                  trait
                                )}`}
                                key={index}
                              >
                                {trait}
                              </div>
                            ))}
                          </div>
                        )}

                        <Link
                          className="m-1 rounded-md px-4 py-2 text-white hover:bg-white/20"
                          href={`https://www.tensor.trade/portfolio?wallet=${herd.owner}&portSlug=claynosaurz`}
                          target="_blank"
                        >
                          <div
                            className={`md:text-md hidden font-bold  md:block`}
                          >
                            {herd.owner}
                          </div>
                          <div
                            className={`text-md block font-bold text-white md:hidden`}
                          >
                            {truncateAccount(herd.owner)}
                          </div>
                        </Link>
                        <div
                          className={`mx-3 my-2 ml-auto rounded-md px-2 py-1 text-xs text-white md:ml-3 ${getRarityColor(
                            herd.rarity
                          )}`}
                        >
                          {herd.rarity}
                        </div>
                      </div>
                      <div
                        className={`flex flex-1 flex-wrap justify-center gap-1`}
                        key={herd.id}
                      >
                        {herd.herd.map((dino) => (
                          <div
                            key={dino.mint}
                            className={`relative h-40 w-40 overflow-clip rounded-md border-2 md:h-48 md:w-48 ${getColor(
                              herd.matches
                            )}`}
                          >
                            <Image
                              src={`https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${dino.gif}`}
                              alt="Clayno gif"
                              quality={100}
                              fill
                            ></Image>
                            {/* {dino.rarity && (
                            <div
                              className={`absolute bottom-0 left-0 m-1 rounded-lg  px-2 py-1 text-xs text-white ${getRarityColor(
                                dino.rarity
                              )}`}
                            >
                              {dino.rarity}
                            </div>
                          )} */}
                          </div>
                        ))}

                        <br />
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </TabSelection>
        </div>
      </main>
      <footer className="flex flex-col items-center bg-black pb-6 text-center text-lg text-white">
        <span className="flex flex-row gap-2">
          <span>Made with</span>
          <Image src="/icons/heart.svg" alt="Love" width={20} height={20} />
          <span>by</span>
          <Link
            href={`https://twitter.com/AlphaDecay235`}
            className="text-sky-500"
            target="_blank"
          >
            <span>@AlphaDecay235</span>
          </Link>
        </span>
      </footer>
    </>
  );
}

// function AuthShowcase() {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// }
