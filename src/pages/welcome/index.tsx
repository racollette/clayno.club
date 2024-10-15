import React from "react";
import TraitGuide from "./trait-guide";
import AncientsCansArtifacts from "./oneofones";

const WelcomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-8">
        <section className="mb-8 rounded-2xl bg-neutral-900 p-8">
          <h1 className="mb-4 text-4xl font-bold">Welcome to Claynotopia!</h1>
          <p className="text-xl">
            Welcome to the world of Claynosaurz —an exciting journey awaits. Our
            Collectors Guide is here to help you navigate the ins and outs of
            Claynotopia.
          </p>
        </section>

        <section className="mb-8 rounded-2xl bg-neutral-900 p-8 shadow-lg">
          <div className="mb-6">
            <h3 className="mb-4 text-2xl font-semibold">Collections</h3>
            <TraitGuide />
            <AncientsCansArtifacts />

            {/* Repeat for other collections */}
          </div>

          {/* Add other sections like Rarity, Class Selection, Herds, etc. */}
        </section>

        <section className="mb-8 rounded-2xl bg-neutral-900 p-8 shadow-lg">
          <h2 className="mb-6 text-3xl font-bold">How was Claynosaurz born?</h2>
          {/* Add origin story content */}
        </section>

        <section className="rounded-2xl bg-neutral-900 p-8 shadow-lg">
          <h2 className="mb-6 text-3xl font-bold text-blue-400">Read more:</h2>
          {/* Add links to resources */}
        </section>
      </main>

      <footer className="mt-8 bg-neutral-900 p-4">
        {/* Add footer content */}
      </footer>
    </div>
  );
};

export default WelcomePage;
