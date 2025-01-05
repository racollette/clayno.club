import React from "react";
import TraitGuide from "./trait-guide";
import AncientsCansArtifacts from "./oneofones";

const WelcomePage: React.FC = () => {
  return (
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
              Our Collectors Guide is here to help you navigate the ins and outs
              of Claynotopia.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="rounded-3xl bg-neutral-900 p-8 shadow-2xl">
          <div className="mb-8">
            <h2 className="mb-6 font-clayno text-2xl text-white">
              Trait Explorer
            </h2>
            <TraitGuide />
          </div>

          <div className="mt-16">
            <AncientsCansArtifacts />
          </div>
        </section>
      </main>

      <footer className="mt-12 border-t border-neutral-800 bg-black py-8">
        <div className="mx-auto max-w-[1400px] px-4 text-center text-neutral-400">
          © {new Date().getFullYear()} Claynosaurz. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
