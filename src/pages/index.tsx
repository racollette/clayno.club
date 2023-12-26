import { useRef } from "react";
import Link from "next/link";
import Metatags from "~/components/MetaTags";
import Image from "next/image";

export default function Home() {
  const browseSectionRef = useRef<HTMLElement | null>(null);

  const scrollToBrowse = () => {
    if (browseSectionRef.current) {
      browseSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Metatags title="Clayno.club | Home" />
      <main className="bg-black text-white">
        <div className="flex flex-col gap-12 p-4 pb-16 md:container">
          <section className="flex flex-col items-center justify-center gap-4 rounded-xl px-4 py-12 md:flex-row md:gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center gap-2">
                <Image
                  src="/icons/dactyl_colored.svg"
                  width="64"
                  height="64"
                  alt="Clayno.club"
                  className="hover:animate-wiggle"
                />
                <h2 className="font-clayno text-3xl">Clayno.club</h2>
              </div>
              <p className="text-xl italic">Your portal to Claynotopia</p>
              <p className="md:text-md w-full text-sm md:w-[500px]">
                Discover the collection, herds, tribes, and lore that define
                Claynotopia! Clayno.club is a fan-curated resource developed by
                members of{" "}
                <Link
                  className="text-cyan-600"
                  href="https://clayno.capital"
                  target="_blank"
                >
                  Clayno Capital
                </Link>
                . Our mission is to provide information and tooling for
                Claynosaurz that fall outside the scope of the core team.
              </p>
              <div className="flex flex-row gap-2">
                <button
                  className="rounded-lg bg-cyan-700 px-8 py-2 hover:bg-cyan-600 md:w-[200px]"
                  onClick={scrollToBrowse}
                >
                  Explore
                </button>
                <button className="rounded-lg border-2 border-cyan-700 px-8 py-2 hover:border-cyan-600 md:w-[200px]">
                  My Inventory
                </button>
              </div>
            </div>
            <div className="rounded-xl">
              <Image
                src="/images/claynotopia.png"
                width="500"
                height="500"
                alt="Claynotopia"
                className="rounded-3xl"
              />
            </div>
          </section>
          <section className="flex flex-col items-center justify-center gap-8 rounded-lg bg-neutral-900 py-6">
            <div className="self-center font-clayno text-2xl">Services</div>
            <div className="flex flex-col items-center gap-4 rounded-xl px-2 md:flex-row md:gap-8 md:px-12">
              <div className="relative h-[150px] w-[150px] md:h-[200px] md:w-[200px]">
                <Image
                  src="/images/logo.png"
                  fill
                  alt="Clayno.club"
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col items-center justify-center gap-4 self-center md:items-start">
                <h2 className="font-clayno text-lg">Telegram Bot</h2>
                <div className="text-md flex md:w-[500px]">
                  <ul>
                    <li>• Automated token gating</li>
                    <li>• Built in commands</li>
                    <li>• Community stats</li>
                    <li>• Trait specific sales feeds</li>
                  </ul>
                </div>
                <div className="flex flex-row gap-2">
                  <Link
                    href="https://t.me/ClaynoClubBot"
                    target="_blank"
                    className="flex w-full flex-row items-center justify-center gap-2 rounded-xl border-2 border-white px-4 py-2 hover:border-cyan-600 md:w-[250px] md:px-8 md:py-2"
                  >
                    <Image
                      src="/icons/telegram.svg"
                      width="32"
                      height="32"
                      alt="Telegram"
                    />
                    Take me there!
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <section
            className="relative flex flex-col items-center overflow-hidden font-clayno"
            ref={browseSectionRef}
          >
            <div className="flex w-full flex-col items-center justify-around gap-8 rounded-xl bg-neutral-900 py-8 md:gap-8 md:p-8">
              <div className="font-clayno text-2xl">Browse</div>
              {/* <div className="absolute w-full origin-center bg-cover bg-repeat">
              <div
                style={{
                  background: `url('/images/3d_herd.jpeg')`,
                }}
                className="h-[5000px] w-[1000px] animate-homepage-dino-pattern bg-repeat md:h-[6000px] md:w-[6000px]"
                // className="h-full w-full animate-homepage-dino-pattern bg-repeat"
              ></div>
            </div> */}
              <div className="flex w-full flex-col items-center justify-center gap-10 md:flex-row">
                <Link
                  className="flex aspect-square w-11/12 cursor-pointer flex-col items-center justify-center gap-4 rounded-xl bg-neutral-800 bg-contain p-8 text-center text-white shadow-2xl  shadow-neutral-900 hover:animate-wiggle md:w-[30%] lg:w-[28%]"
                  style={{
                    background: `url('/images/trailer_herd.jpeg')`,
                    backgroundSize: `100%`,
                  }}
                  href={`/herds`}
                >
                  <h1 className="rounded-lg  bg-neutral-900/70 p-2 text-2xl font-black lg:text-3xl">
                    Herds
                  </h1>
                  <h2 className="lg:text-md rounded-lg bg-neutral-900/70 p-2 text-sm font-semibold text-white">
                    Collectors gallery
                  </h2>
                </Link>
                <Link
                  className="flex aspect-square w-11/12 cursor-pointer flex-col items-center justify-center gap-4 rounded-xl bg-neutral-800 bg-contain p-8 text-center text-white shadow-2xl  shadow-neutral-900 hover:animate-wiggle md:w-[30%] lg:w-[28%]"
                  style={{
                    background: `url('/images/SMALLER_FJORD_CLAYNOS.jpg')`,
                    backgroundSize: `100%`,
                  }}
                  href={`/tribes`}
                >
                  <h1 className="rounded-lg  bg-neutral-900/70 p-2 text-2xl font-black lg:text-3xl">
                    Tribes
                  </h1>
                  <h2 className="lg:text-md rounded-lg bg-neutral-900/70 p-2 text-sm font-semibold text-white">
                    {`Claynotopia's sub-communities!`}
                  </h2>
                </Link>
                <Link
                  className="flex aspect-square w-11/12 cursor-pointer flex-col items-center justify-center gap-4 rounded-xl bg-neutral-800 bg-contain p-8 text-center  text-white shadow-2xl shadow-neutral-900 hover:animate-wiggle md:w-[30%] lg:w-[28%]"
                  style={{
                    background: `url('/gifs/GIF_RaptorThinking.gif')`,
                    // backgroundSize: `100%`,
                    backgroundSize: `cover`,
                  }}
                  href={`/stats`}
                >
                  <h1 className="rounded-lg  bg-neutral-900/70 p-2 text-2xl font-black lg:text-3xl">
                    Stats
                  </h1>
                  <h2 className="lg:text-md rounded-lg bg-neutral-900/70 p-2 text-sm font-semibold text-white">
                    Data and analytics
                  </h2>
                </Link>
              </div>
              <div className="flex w-full flex-col items-center justify-center gap-10 md:flex-row">
                <Link
                  className="flex aspect-square w-11/12 cursor-pointer flex-col items-center justify-center gap-4 rounded-xl bg-neutral-800 bg-contain p-8 text-center  text-white shadow-2xl shadow-neutral-900 hover:animate-wiggle md:w-[30%] lg:w-[28%]"
                  style={{
                    background: `url('/images/sticker_collage.png')`,
                    backgroundSize: `100%`,
                  }}
                  href={`/tools`}
                >
                  <h1 className="rounded-lg  bg-neutral-900/70 p-2 text-2xl font-black lg:text-3xl">
                    Tools
                  </h1>
                  <h2 className="lg:text-md rounded-lg bg-neutral-900/70 p-2 text-sm font-semibold text-white">
                    Collage creation and more!
                  </h2>
                </Link>
                <Link
                  className="flex aspect-square w-11/12 cursor-pointer flex-col items-center justify-center gap-4 rounded-xl bg-neutral-800 bg-contain p-8 text-center  text-white shadow-2xl shadow-neutral-900 hover:animate-wiggle md:w-[30%] lg:w-[28%]"
                  style={{
                    background: `url('/images/attic.png')`,
                    backgroundSize: `contain`,
                  }}
                  href={`/resources`}
                >
                  <h1 className="rounded-lg  bg-neutral-900/70 p-2 text-2xl font-black lg:text-3xl">
                    Resources
                  </h1>
                  <h2 className="lg:text-md rounded-lg bg-neutral-900/70 p-2 text-sm font-semibold text-white">
                    Useful links and information
                  </h2>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
