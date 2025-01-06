import React from "react";
import TraitGuide from "./trait-guide";
import AncientsCansArtifacts from "./oneofones";
import MetaTags from "~/components/MetaTags";

const WelcomePage: React.FC = () => {
  return (
    <>
      <MetaTags
        title="Welcome to Claynotopia | Clayno Club"
        description="Welcome to the world of Claynosaurz —an exciting journey awaits. Our Collectors Guide is here to help you navigate the ins and outs of Claynotopia."
      />
      <div className="min-h-screen bg-black">
        <main className="mx-auto max-w-[1400px] px-4 py-12">
          {/* Hero Section */}
          <section className="mb-12 rounded-3xl bg-neutral-900 p-8 shadow-xl">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 font-clayno text-5xl text-white">
                Welcome to Claynotopia!
              </h1>
              <p className="text-xl font-medium leading-relaxed text-neutral-200">
                Welcome to the world of Claynosaurz —an exciting journey awaits.
                Our Collectors Guide is here to help you navigate the ins and
                outs of Claynotopia.
              </p>
            </div>
          </section>

          {/* Main Content */}
          <section className="rounded-3xl bg-neutral-900 p-8 shadow-2xl">
            {/* The Characters Introduction */}
            <div className="mb-12">
              <h2 className="mb-6 font-clayno text-3xl text-white">
                The Characters
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg bg-neutral-800 p-6">
                  <h3 className="font-clayno text-xl text-blue-400">
                    Genesis Collection
                    <span className="ml-2 text-sm text-neutral-400">
                      1st Edition
                    </span>
                  </h3>
                  <p className="mt-2 text-neutral-300">
                    10,222 original Claynosaurz released in November 2022
                    featuring seven species: Rex, Trice, Stego, Ankylo, Bronto,
                    Raptor, and Dactyl.
                  </p>
                </div>
                <div className="rounded-lg bg-neutral-800 p-6">
                  <h3 className="font-clayno text-xl text-yellow-400">
                    Call of Saga
                    <span className="ml-2 text-sm text-neutral-400">
                      2nd Edition
                    </span>
                  </h3>
                  <p className="mt-2 text-neutral-300">
                    The Expansion Collection. 2,000 characters comprising of 2
                    unique species (Para & Spino) released in partnership with
                    Solana Mobile in March of 2023.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="mb-6 font-clayno text-2xl text-white">
                Trait Explorer
              </h2>
              <TraitGuide />
            </div>

            <div className="mt-16">
              <h2 className="mb-6 font-clayno text-2xl text-white">
                One of Ones
              </h2>
              <AncientsCansArtifacts />
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default WelcomePage;
