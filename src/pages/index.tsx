import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { api } from "~/utils/api";
import { truncateAccount } from "~/utils/addresses";

const getColor = (matches: string, type: string) => {
  const color = matches.split("_")[1];
  let code = "";
  switch (color) {
    case "Amethyst":
      code = "purple-500";
      break;
    case "Aqua":
      code = "sky-600";
      break;
    case "Charcoal":
      code = "stone-900";
      break;
    case "Desert":
      code = "yellow-500";
      break;
    case "Mist":
      code = "slate-300";
      break;
    case "Spring":
      code = "rose-300";
      break;
    case "Tropic":
      code = "emerald-500";
      break;
    case "Volcanic":
      code = "red-600";
      break;
    default:
      code = "slate-100";
      break;
  }
  return `${type}-${code}`;
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

  console.log(t1Herds);

  return (
    <>
      <Head>
        <title>Clayno Herds</title>
        <meta name="description" content="Created by AlphaDecay" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          {/* <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/usage/first-steps"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">First Steps →</h3>
              <div className="text-lg">
                Just the basics - Everything you need to know to set up your
                database and authentication.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Documentation →</h3>
              <div className="text-lg">
                Learn more about Create T3 App, the libraries it uses, and how
                to deploy it.
              </div>
            </Link>
          </div> */}
          {/* <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
            <AuthShowcase />
          </div> */}
          <div className="flex flex-col items-center gap-2">
            <p className="p-4 text-4xl text-white">3 Trait Herds</p>
            {t1Herds.data &&
              t1Herds.data?.map((herd) => (
                <div
                  key={herd.id}
                  className="mb-4 flex flex-col items-center text-center"
                >
                  <Link
                    className={`mb-1 w-full rounded-md border-2 bg-sky-600 bg-white/10 p-4 text-white hover:bg-white/20 ${getColor(
                      herd.matches,
                      "border"
                    )}`}
                    href={`https://www.tensor.trade/portfolio?wallet=${herd.owner}&portSlug=claynosaurz`}
                    target="_blank"
                  >
                    <div className={`md:text-large hidden font-bold  md:block`}>
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
                        className={`relative h-40 w-40 rounded-md border-4 md:h-48 md:w-48 ${getColor(
                          herd.matches,
                          "border"
                        )}`}
                      >
                        <Image
                          src={`https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${dino.gif}`}
                          alt="Clayno gif"
                          quality={100}
                          // width={150}
                          // height={150}
                          fill
                        ></Image>
                      </div>
                    ))}

                    <br />
                  </div>
                </div>
              ))}
          </div>
          {/* <div className="flex flex-col items-center gap-2">
            <p className="p-4 text-4xl text-white">2 Trait Herds</p>
            {t2Herds.data &&
              t2Herds.data?.map((herd) => (
                <div key={herd.id} className="mb-4 items-center text-center">
                  <Link
                    className="mb-1 flex flex-col rounded-md bg-white/10 p-4 text-white hover:bg-white/30"
                    href={`https://www.tensor.trade/portfolio?wallet=${herd.owner}&portSlug=claynosaurz`}
                    target="_blank"
                  >
                    <div className="text-lg font-bold text-white">
                      {herd.owner}
                    </div>
                  </Link>
                  <div
                    className={`flex rounded-md border-2 ${getBorderColor(
                      herd.matches
                    )}`}
                    key={herd.id}
                  >
                    {herd.herd.map((dino) => (
                      <div
                        key={dino.mint}
                        className={`relative h-48 w-48 border-2 ${getBorderColor(
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
          </div> */}
        </div>
      </main>
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
