import Head from "next/head";
import { Fragment, useState } from "react";
import { api } from "~/utils/api";
import TabSelection from "~/components/TabSelection";
import Herd from "~/components/Herd";
import Image from "next/image";

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
  const [showDactyl, setShowDactyl] = useState(false);
  const [showSaga, setShowSaga] = useState(false);
  const [showPFP, setShowPFP] = useState(false);

  function toggleDactyl(newToggleState: boolean) {
    setShowDactyl(newToggleState);
  }

  const toggleSaga = (newToggleState: boolean) => {
    setShowSaga(newToggleState);
  };

  const togglePFP = (newToggleState: boolean) => {
    setShowPFP(newToggleState);
  };

  const herds = api.useQueries((t) =>
    [1, 2, 3, 4].map((tier) => t.herd.getHerdTier({ tier: tier }))
  );
  const isLoading = herds.some((queryResult) => queryResult.isLoading);

  return (
    <>
      <Head>
        <title>DinoHerd | Home</title>
        <meta name="description" content="Claynosaurz Herd Showcase" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative flex min-h-screen flex-col items-center justify-center bg-black">
        {isLoading ? (
          <div className="relative mb-24 aspect-square w-1/2 overflow-clip rounded-full border-2 border-zinc-700 text-white md:w-1/4">
            <Image
              src="/gifs/TTT.gif"
              alt="Loading"
              fill
              className="rounded-full"
            />
          </div>
        ) : (
          <div className=" flex flex-col items-center justify-center py-2 md:px-4">
            <div className="flex w-full flex-row flex-wrap align-middle">
              <div className="relative m-4 aspect-video w-full p-4">
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
              showPFP={showPFP}
              toggleDactyl={toggleDactyl}
              toggleSaga={toggleSaga}
              togglePFP={togglePFP}
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
                        showOwner={true}
                        showPFP={showPFP}
                      />
                    ))}
                </div>
              ))}
            </TabSelection>
          </div>
        )}
      </main>
    </>
  );
}

// function AuthShowcase() {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.herd.getSecretMessage.useQuery(
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
