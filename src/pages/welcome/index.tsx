import React from "react";
import TraitGuide from "./trait-guide";
import AncientsCansArtifacts from "./oneofones";
import CosmeticsExplorer from "./cosmetics";
import PopularTraits from "./popular-traits";
import Resources from "./resources";
import MetaTags from "~/components/MetaTags";
import { useImageViewer } from "~/hooks/useImageViewer";
import ImageViewer from "~/components/ImageViewer";
import Image from "next/image";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "~/@/components/ui/tabs";
import { cn } from "~/@/lib/utils";

const WelcomePage: React.FC = () => {
  const { selectedImage, isOpen, openImage, closeImage } = useImageViewer();

  return (
    <>
      <MetaTags
        title="Welcome to Claynotopia | Claynosaurz Collectibles explained"
        description="Welcome to the world of Claynosaurz —an exciting journey awaits. Our Collectors Guide is here to help you navigate the ins and outs of the digital collectibles of Claynotopia."
      />
      <ImageViewer
        isOpen={isOpen}
        imageUrl={selectedImage || ""}
        onClose={closeImage}
      />
      <div className="min-h-screen bg-black">
        <main className="mx-auto max-w-[1400px] px-2 py-4 sm:px-4 sm:py-12">
          {/* Hero Section */}
          <section className="relative mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 shadow-xl sm:mb-12 sm:rounded-3xl">
            <div
              className="absolute inset-0 animate-[float_20s_ease-in-out_infinite] opacity-[0.25]"
              style={{
                backgroundImage: 'url("/images/clayno_bg.svg")',
                backgroundSize: "110%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />
            <style jsx>{`
              @keyframes float {
                0%,
                100% {
                  transform: scale(1.1) rotate(0deg);
                }
                50% {
                  transform: scale(1.15) rotate(1deg);
                }
              }
            `}</style>
            <div className="mx-auto max-w-4xl">
              <div className="relative flex flex-col items-center gap-4 p-4 text-center sm:gap-6 sm:p-8">
                <div className="flex-shrink-0">
                  <Image
                    src="/images/clayno_logo_horizontal.png"
                    alt="Claynosaurz"
                    width={400}
                    height={100}
                    className="w-[240px] sm:w-[360px]"
                    priority
                  />
                </div>
                <div className="max-w-2xl">
                  <h2 className="mb-2 font-clayno text-xl text-white sm:mb-3 sm:text-3xl">
                    Welcome to Claynotopia!
                  </h2>
                  <p className="max-w-md text-sm font-semibold leading-relaxed text-neutral-200/90 sm:text-base">
                    An exciting journey awaits. Our Collectors Guide is here to
                    help you navigate the collectible ecosystem.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="mb-4 rounded-2xl bg-neutral-900 p-3 shadow-2xl sm:mb-12 sm:rounded-3xl sm:p-8">
            {/* The Characters Introduction */}
            <div>
              <h2 className="mb-2 font-clayno text-2xl text-white sm:mb-4 sm:text-3xl">
                The Claynos
              </h2>
              <p className="mb-4 text-sm text-neutral-300 sm:mb-8 sm:text-lg">
                {
                  "Claynosaurz are your access passes to the ecosystem. Each character (Genesis or Saga) carries the same core utility and benefits. You'll want one of these to begin your journey."
                }
              </p>
              <div className="grid gap-3 sm:gap-6 md:grid-cols-2">
                <div className="rounded-lg bg-neutral-800 p-3 sm:p-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <h3 className="flex flex-wrap items-center gap-2 font-clayno text-lg text-blue-400 sm:text-xl">
                        Genesis Collection
                        <span className="text-xs text-neutral-400 sm:text-sm">
                          1st Edition
                        </span>
                      </h3>
                      <div className="flex gap-1 sm:gap-2">
                        <a
                          href="https://www.tensor.trade/trade/claynosaurz"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-700 p-1.5 transition-colors hover:bg-neutral-600 sm:h-8 sm:w-8"
                        >
                          <Image
                            src="/icons/tensor.svg"
                            alt="View on Tensor"
                            width={16}
                            height={16}
                            className="opacity-80 sm:h-5 sm:w-5"
                          />
                        </a>
                        <a
                          href="https://magiceden.io/marketplace/claynosaurz"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-700 p-1.5 transition-colors hover:bg-neutral-600 sm:h-8 sm:w-8"
                        >
                          <Image
                            src="/icons/magic_eden.svg"
                            alt="View on Magic Eden"
                            width={16}
                            height={16}
                            className="opacity-80 sm:h-5 sm:w-5"
                          />
                        </a>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-300">
                      10,232 original Claynosaurz released in November 2022
                      featuring seven species: Rex, Trice, Stego, Ankylo,
                      Bronto, Raptor, and Dactyl.
                    </p>
                  </div>
                </div>
                <div className="rounded-lg bg-neutral-800 p-3 sm:p-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <h3 className="flex flex-wrap items-center gap-2 font-clayno text-lg text-yellow-400 sm:text-xl">
                        Call of Saga
                        <span className="text-xs text-neutral-400 sm:text-sm">
                          2nd Edition
                        </span>
                      </h3>
                      <div className="flex gap-1 sm:gap-2">
                        <a
                          href="https://www.tensor.trade/trade/saga"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-700 p-1.5 transition-colors hover:bg-neutral-600 sm:h-8 sm:w-8"
                        >
                          <Image
                            src="/icons/tensor.svg"
                            alt="View on Tensor"
                            width={16}
                            height={16}
                            className="opacity-80 sm:h-5 sm:w-5"
                          />
                        </a>
                        <a
                          href="https://magiceden.io/marketplace/claynosaurz_saga"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-700 p-1.5 transition-colors hover:bg-neutral-600 sm:h-8 sm:w-8"
                        >
                          <Image
                            src="/icons/magic_eden.svg"
                            alt="View on Magic Eden"
                            width={16}
                            height={16}
                            className="opacity-80 sm:h-5 sm:w-5"
                          />
                        </a>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-300">
                      The Expansion Collection. 2,000 characters comprising of 2
                      unique species (Para & Spino) released in March 2023.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-4 flex flex-col gap-2 border-b border-neutral-800 pb-2 sm:mb-6 sm:pb-4">
                  <h3 className="font-clayno text-xl text-white sm:text-2xl">
                    Trait Explorer
                  </h3>
                  <p className="text-xs text-neutral-400 sm:text-base">
                    Compare the different Claynosaurz traits side-by-side, or
                    check out the most sought-after combinations.
                  </p>
                </div>
                <Tabs
                  defaultValue="all-traits"
                  className="space-y-3 sm:space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <TabsList className="flex gap-1 rounded-md bg-neutral-900 sm:gap-2">
                      <TabsTrigger
                        value="all-traits"
                        className="rounded-sm px-2 py-1 text-xs font-medium text-neutral-300 ring-offset-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100 data-[state=active]:shadow-sm sm:px-3 sm:text-sm"
                      >
                        All Traits
                      </TabsTrigger>
                      <TabsTrigger
                        value="popular-traits"
                        className={cn(
                          "relative rounded-sm px-2 py-1 text-xs font-medium text-neutral-300 ring-offset-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100 data-[state=active]:shadow-sm sm:px-3 sm:text-sm",
                          "after:absolute after:right-0 after:top-0 after:h-2.5 after:w-2.5 after:-translate-y-1 after:translate-x-0.5 after:animate-pulse after:rounded-full after:bg-purple-500/90 after:shadow-[0_0_8px_rgba(168,85,247,0.4)] sm:after:h-3 sm:after:w-3",
                          "animate-pulse bg-purple-500/10 hover:bg-purple-500/20"
                        )}
                      >
                        Popular Combinations
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="all-traits">
                    <TraitGuide />
                  </TabsContent>
                  <TabsContent value="popular-traits">
                    <PopularTraits />
                  </TabsContent>
                </Tabs>
              </div>

              <div className="mt-8 sm:mt-16">
                <h3 className="mb-4 font-clayno text-xl text-white sm:mb-6 sm:text-2xl">
                  One of Ones
                </h3>
                <AncientsCansArtifacts />
              </div>
            </div>
          </section>

          {/* Cosmetics Section */}
          <section className="mb-4 rounded-2xl bg-neutral-900 p-3 shadow-2xl sm:mb-12 sm:rounded-3xl sm:p-8">
            <div>
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <h2 className="font-clayno text-xl text-white sm:text-3xl">
                  COSMETICS
                </h2>
                <div className="flex gap-1 sm:gap-2">
                  <a
                    href="https://www.tensor.trade/trade/saga"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-700 p-1.5 transition-colors hover:bg-neutral-600 sm:h-8 sm:w-8"
                  >
                    <Image
                      src="/icons/tensor.svg"
                      alt="View on Tensor"
                      width={16}
                      height={16}
                      className="opacity-80 sm:h-5 sm:w-5"
                    />
                  </a>
                  <a
                    href="https://magiceden.io/marketplace/claynosaurz_saga"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-700 p-1.5 transition-colors hover:bg-neutral-600 sm:h-8 sm:w-8"
                  >
                    <Image
                      src="/icons/magic_eden.svg"
                      alt="View on Magic Eden"
                      width={16}
                      height={16}
                      className="opacity-80 sm:h-5 sm:w-5"
                    />
                  </a>
                </div>
              </div>
              <p className="mb-4 mt-3 text-sm text-neutral-300 sm:mb-8 sm:mt-4 sm:text-lg">
                The Cosmetics Collection holds optional gear, emotes, and poses
                to customize your Claynosaurz characters. These items will be
                redeemable in the Claynosaurz mobile game (under development).
                Not required for gameplay, but they add extra flair to your
                character.
              </p>
              <div>
                <div className="mt-4 sm:mt-8">
                  <CosmeticsExplorer />
                </div>
              </div>
            </div>
          </section>

          {/* Resources Section */}
          <section className="mb-4 rounded-2xl bg-neutral-900 p-3 shadow-2xl sm:mb-12 sm:rounded-3xl sm:p-8">
            <div>
              <h2 className="mb-2 font-clayno text-xl text-white sm:mb-4 sm:text-3xl">
                Resources
              </h2>
              <p className="mb-4 text-sm text-neutral-300 sm:mb-8 sm:text-lg">
                The Claynosaurz ecosystem is powered by two key resources that
                enhance the utility and experience of character holders.
              </p>
              <Resources />
            </div>
          </section>

          {/* FAQ Section */}
          <section className="relative mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 p-3 shadow-xl sm:mb-12 sm:rounded-3xl sm:p-8">
            <div className="relative">
              {/* FAQ Header */}
              <div className="mb-12 pt-3 sm:pt-4">
                <h1 className="mb-6 font-clayno text-3xl uppercase tracking-wide text-yellow-400 sm:text-4xl">
                  Explore the world of Claynosaurz collectibles
                </h1>
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed text-neutral-200/90 sm:text-base">
                    If you already found your favorite collectibles, it's time
                    to unlock exclusive perks, connect with fellow collectors,
                    and experience the next evolution of digital fandom with
                    Claynosaurz.
                  </p>
                  <p className="text-sm leading-relaxed text-neutral-200/90 sm:text-base">
                    Please find the most frequently asked questions below.
                  </p>
                </div>
              </div>

              <h3 className="mb-8 font-clayno text-xl uppercase tracking-wide text-yellow-400/90 sm:text-2xl">
                Frequently Asked Questions
              </h3>
              <div className="space-y-6">
                <div
                  itemScope
                  itemType="https://schema.org/Question"
                  className="group overflow-hidden rounded-xl bg-neutral-800 transition-all duration-300 hover:bg-neutral-700"
                >
                  <div className="p-6">
                    <h4 className="mb-4 text-lg font-medium text-white sm:text-xl">
                      How do I join the Claynosaurz community?
                    </h4>
                    <div
                      itemScope
                      itemType="https://schema.org/Answer"
                      className="rounded-lg bg-neutral-900/50 p-4"
                    >
                      <p className="text-sm leading-relaxed text-neutral-300 sm:text-base">
                        You are part of the herd if you own any Claynosaurz
                        digital collectibles (NFTs). Join token-gated chats
                        through Clayno.Club and verify your assets in the
                        official Claynosaurz Discord. When you have verified
                        your collectibles, you can participate in community
                        meetups, sign up for events, or participate in community
                        giveaways.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Update the same classes for all FAQ items */}
                {/* Example for one more item, repeat for others */}
                <div
                  itemScope
                  itemType="https://schema.org/Question"
                  className="group overflow-hidden rounded-xl bg-neutral-800 transition-all duration-300 hover:bg-neutral-700"
                >
                  <div className="p-6">
                    <h4 className="mb-4 text-lg font-medium text-white sm:text-xl">
                      What benefits do collectible holders get aside from owning
                      the artwork?
                    </h4>
                    <div
                      itemScope
                      itemType="https://schema.org/Answer"
                      className="rounded-lg bg-neutral-900/50 p-4"
                    >
                      <p className="text-sm leading-relaxed text-neutral-300 sm:text-base">
                        Claynosaurz collectors can enjoy exclusive access to the
                        Claynosaurz ecosystem. This includes but is not limited
                        to events, early releases, access to holders' gated
                        content, and other activations.
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  itemScope
                  itemType="https://schema.org/Question"
                  className="group overflow-hidden rounded-xl bg-neutral-800 transition-all duration-300 hover:bg-neutral-700"
                >
                  <div className="p-6">
                    <h4 className="mb-4 text-lg font-medium text-white sm:text-xl">
                      What are herds? Some collectors display their herds in
                      their socials.
                    </h4>
                    <div
                      itemScope
                      itemType="https://schema.org/Answer"
                      className="rounded-lg bg-neutral-900/50 p-4"
                    >
                      <p className="text-sm leading-relaxed text-neutral-300 sm:text-base">
                        While there is no official definition of a herd, a herd
                        means a specific group of Claynosaurz collectibles owned
                        by one collector. This can mean anything from collecting
                        one of each species or going after more specific
                        "perfect" herds with multiple matching traits and/or
                        backgrounds.{" "}
                        <a
                          href="https://clayno.club/herds"
                          className="text-yellow-400 transition-colors hover:text-yellow-300 hover:underline"
                        >
                          View herds
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  itemScope
                  itemType="https://schema.org/Question"
                  className="group overflow-hidden rounded-xl bg-neutral-800 transition-all duration-300 hover:bg-neutral-700"
                >
                  <div className="p-6">
                    <h4 className="mb-4 text-lg font-medium text-white sm:text-xl">
                      What determines the rarity and value of a Claynosaurz
                      collectible?
                    </h4>
                    <div
                      itemScope
                      itemType="https://schema.org/Answer"
                      className="rounded-lg bg-neutral-900/50 p-4"
                    >
                      <p className="text-sm leading-relaxed text-neutral-300 sm:text-base">
                        Collectors value traits and trait combos over strict
                        mathematical rarity. When diving into the collection,
                        you will find multiple sought-after collectible
                        features. You can browse the features of the
                        collectibles above and get to know the most popular
                        traits and trait combinations.
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  itemScope
                  itemType="https://schema.org/Question"
                  className="group overflow-hidden rounded-xl bg-neutral-800 transition-all duration-300 hover:bg-neutral-700"
                >
                  <div className="p-6">
                    <h4 className="mb-4 text-lg font-medium text-white sm:text-xl">
                      What is the total supply of Claynosaurz, and will there be
                      more?
                    </h4>
                    <div
                      itemScope
                      itemType="https://schema.org/Answer"
                      className="rounded-lg bg-neutral-900/50 p-4"
                    >
                      <p className="text-sm leading-relaxed text-neutral-300 sm:text-base">
                        The first edition collection (Claynosaurz) has a supply
                        of 10,232, and the second edition (Claynosaurz: The Call
                        of Saga) has a supply of 2000. These two collections are
                        considered the original Claynosaurz collectibles. Other
                        supporting collections have a bigger supply, and the
                        team has hinted about further expansions.
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  itemScope
                  itemType="https://schema.org/Question"
                  className="group overflow-hidden rounded-xl bg-neutral-800 transition-all duration-300 hover:bg-neutral-700"
                >
                  <div className="p-6">
                    <h4 className="mb-4 text-lg font-medium text-white sm:text-xl">
                      What is Clayno Capital?
                    </h4>
                    <div
                      itemScope
                      itemType="https://schema.org/Answer"
                      className="rounded-lg bg-neutral-900/50 p-4"
                    >
                      <p className="text-sm leading-relaxed text-neutral-300 sm:text-base">
                        <a
                          href="https://clayno.capital"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-yellow-400 transition-colors hover:text-yellow-300 hover:underline"
                        >
                          Clayno Capital
                        </a>{" "}
                        is a group of high-conviction collectors who hold 25 OG
                        Claynosaurz or an Ancient. Clayno.Club and the
                        collector's tools are hosted by Clayno Capital.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default WelcomePage;
