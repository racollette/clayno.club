import Link from "next/link";
import Metatags from "~/components/MetaTags";

export default function Home() {
  return (
    <>
      <Metatags title="DinoHerd | Home" />
      <main className="relative flex min-h-screen min-w-full flex-col items-center justify-center overflow-hidden font-clayno">
        <div className="absolute origin-center -rotate-[9deg] bg-cover bg-repeat">
          <div
            style={{
              background: `url('/images/3d_herd.jpeg')`,
            }}
            className="h-[5000px] w-[1000px] animate-homepage-dino-pattern bg-repeat md:h-[6000px] md:w-[6000px]"
          ></div>
        </div>
        <div className="z-10 my-16 flex w-full flex-col items-center justify-around gap-16 space-y-6 md:gap-12">
          <div className="flex w-full flex-col items-center justify-around gap-10 md:flex-row">
            <Link
              className="flex aspect-square w-3/4 -rotate-[9deg] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl bg-neutral-800 bg-contain p-8 text-center text-white shadow-2xl  shadow-neutral-900 hover:animate-wiggle md:w-[30%] lg:w-[21%]"
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
              className="flex aspect-square w-3/4 -rotate-[9deg] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl bg-neutral-800 bg-contain p-8 text-center text-white shadow-2xl  shadow-neutral-900 hover:animate-wiggle md:w-[30%] lg:w-[21%]"
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
              className="flex aspect-square w-3/4 -rotate-[9deg] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl bg-neutral-800 bg-contain p-8 text-center  text-white shadow-2xl shadow-neutral-900 hover:animate-wiggle md:w-[30%] lg:w-[21%]"
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
          <div className="flex w-full flex-col items-center justify-around gap-10 md:flex-row">
            <Link
              className="flex aspect-square w-3/4 -rotate-[9deg] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl bg-neutral-800 bg-contain p-8 text-center  text-white shadow-2xl shadow-neutral-900 hover:animate-wiggle md:w-[30%] lg:w-[21%]"
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
              className="flex aspect-square w-3/4 -rotate-[9deg] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl bg-neutral-800 bg-contain p-8 text-center  text-white shadow-2xl shadow-neutral-900 hover:animate-wiggle md:w-[30%] lg:w-[21%]"
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
      </main>
    </>
  );
}
