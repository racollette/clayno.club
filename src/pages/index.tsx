import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { api } from "~/utils/api";
import Link from "next/link";
import TabSelection from "~/components/TabSelection";
import Herd from "~/components/Herd";

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

export default function Home() {
  const [showDactyl, setShowDactyl] = useState(true);
  const [showSaga, setShowSaga] = useState(true);

  function toggleDactyl(newToggleState: boolean) {
    setShowDactyl(newToggleState);
  }

  const toggleSaga = (newToggleState: boolean) => {
    setShowSaga(newToggleState);
  };

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
      <main className="relative flex min-h-screen flex-col items-center bg-black">
        <div className=" flex flex-col items-center justify-center py-2 md:w-4/5 md:px-4">
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
            showDactyl={showDactyl}
            showSaga={showSaga}
            toggleDactyl={toggleDactyl}
            toggleSaga={toggleSaga}
          >
            {herds.map((tier, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                {tier.data &&
                  tier.data?.map((herd) => (
                    <Herd
                      key={herd.id}
                      herd={herd}
                      showDactyl={showDactyl}
                      showSaga={showSaga}
                    />
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
