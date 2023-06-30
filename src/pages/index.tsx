import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { api } from "~/utils/api";
import { truncateAccount } from "~/utils/addresses";
import TabSelection from "~/components/TabSelection";

const getColor = (matches: string) => {
  const color = matches.split("_")[1];
  switch (color) {
    case "Amethyst":
      return "border-purple-500";
    case "Aqua":
      return "border-sky-600";
    case "Charcoal":
      return "border-stone-900";
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
  const t1Herds = api.example.getT1Herds.useQuery();
  const t2Herds = api.example.getT2Herds.useQuery();

  return (
    <>
      <Head>
        <title>Dino Herds</title>
        <meta name="description" content="Claynosaurz Herd Showcase" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <div className="container flex flex-col items-center justify-center px-4 py-8 ">
          <div className="flex flex-row flex-wrap align-middle">
            <div className="relative p-4">
              <img
                src="https://pbs.twimg.com/media/FqOrzzRXoAQ3yjV?format=jpg"
                alt="Claynosaurz"
                className="h-auto w-full rounded-2xl"
              />
              <div className="absolute left-0 top-0 hidden h-full w-full items-start justify-end md:flex">
                <div className="m-6 flex max-w-lg flex-col gap-4 rounded-xl bg-black/70 p-8 text-white hover:bg-black/30">
                  <h2 className="text-xl font-extrabold text-white md:text-3xl">
                    Dino <span className="text-[hsl(280,100%,70%)]">Herds</span>
                  </h2>
                  <div className="text-sm md:text-lg">
                    <p className="pb-2">
                      A herd is a collector achievement consisting of one of
                      each Claynosaur species.
                    </p>
                    <p>The more matching traits the better!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <TabSelection
            labels={["3 Trait", "2 Trait", "1 Trait", "0 Trait"]}
            counts={[
              t1Herds?.data?.length ?? 0,
              t2Herds?.data?.length ?? 0,
              t1Herds?.data?.length ?? 0,
              t1Herds?.data?.length ?? 0,
            ]}
          >
            <div className="flex flex-col items-center gap-2">
              {t1Herds.data &&
                t1Herds.data?.map((herd) => (
                  <div
                    key={herd.id}
                    className="mb-4 flex flex-col items-center text-center"
                  >
                    <Link
                      className={`mb-1 w-full rounded-md border-2 bg-white/10 p-4 text-white hover:bg-white/20 ${getColor(
                        herd.matches
                      )}`}
                      href={`https://www.tensor.trade/portfolio?wallet=${herd.owner}&portSlug=claynosaurz`}
                      target="_blank"
                    >
                      <div
                        className={`md:text-large hidden font-bold  md:block`}
                      >
                        {herd.owner}
                      </div>
                      <div
                        className={`text-large block font-bold text-white md:hidden`}
                      >
                        {truncateAccount(herd.owner)}
                      </div>
                    </Link>
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
                        </div>
                      ))}

                      <br />
                    </div>
                  </div>
                ))}
            </div>
            <div>
              <div className="flex flex-col items-center gap-2">
                {t2Herds.data &&
                  t2Herds.data?.map((herd) => (
                    <div
                      key={herd.id}
                      className="mb-4 flex flex-col items-center text-center"
                    >
                      <Link
                        className={`mb-1 w-full rounded-md border-2 bg-white/10 p-4 text-white hover:bg-white/20 ${getColor(
                          herd.matches
                        )}`}
                        href={`https://www.tensor.trade/portfolio?wallet=${herd.owner}&portSlug=claynosaurz`}
                        target="_blank"
                      >
                        <div
                          className={`md:text-large hidden font-bold  md:block`}
                        >
                          {herd.owner}
                        </div>
                        <div
                          className={`text-large block font-bold text-white md:hidden`}
                        >
                          {truncateAccount(herd.owner)}
                        </div>
                      </Link>
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
                          </div>
                        ))}

                        <br />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <div className="flex flex-col items-center gap-2">
                {t1Herds.data &&
                  t1Herds.data?.map((herd) => (
                    <div
                      key={herd.id}
                      className="mb-4 flex flex-col items-center text-center"
                    >
                      <Link
                        className={`mb-1 w-full rounded-md border-2 bg-white/10 p-4 text-white hover:bg-white/20 ${getColor(
                          herd.matches
                        )}`}
                        href={`https://www.tensor.trade/portfolio?wallet=${herd.owner}&portSlug=claynosaurz`}
                        target="_blank"
                      >
                        <div
                          className={`md:text-large hidden font-bold  md:block`}
                        >
                          {herd.owner}
                        </div>
                        <div
                          className={`text-large block font-bold text-white md:hidden`}
                        >
                          {truncateAccount(herd.owner)}
                        </div>
                      </Link>
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
                          </div>
                        ))}

                        <br />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <div className="flex flex-col items-center gap-2">
                {t1Herds.data &&
                  t1Herds.data?.map((herd) => (
                    <div
                      key={herd.id}
                      className="mb-4 flex flex-col items-center text-center"
                    >
                      <Link
                        className={`mb-1 w-full rounded-md border-2 bg-white/10 p-4 text-white hover:bg-white/20 ${getColor(
                          herd.matches
                        )}`}
                        href={`https://www.tensor.trade/portfolio?wallet=${herd.owner}&portSlug=claynosaurz`}
                        target="_blank"
                      >
                        <div
                          className={`md:text-large hidden font-bold  md:block`}
                        >
                          {herd.owner}
                        </div>
                        <div
                          className={`text-large block font-bold text-white md:hidden`}
                        >
                          {truncateAccount(herd.owner)}
                        </div>
                      </Link>
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
                          </div>
                        ))}

                        <br />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
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
