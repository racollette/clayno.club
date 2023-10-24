import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>DinoHerd | Home</title>
        <meta name="description" content="Claynosaurz Collectors Gallery" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative flex min-h-screen min-w-full flex-col items-center justify-center overflow-hidden">
        <div className="absolute origin-center -rotate-[9deg] bg-cover bg-repeat">
          <div
            style={{
              background: `url('/images/3d_herd.jpeg')`,
            }}
            className="h-[5000px] w-[1000px] animate-homepage-dino-pattern bg-repeat md:h-[5000px] md:w-[5000px]"
          ></div>
        </div>
        <div className="z-10 my-16 flex w-full flex-col items-center justify-around gap-16 md:flex-row md:gap-10">
          <Link
            className="flex aspect-square w-3/4 -rotate-[9deg] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl bg-neutral-800 bg-contain p-8 text-center text-white  shadow-2xl shadow-neutral-900 hover:animate-wiggle md:w-1/5 lg:w-1/4"
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
            className="flex aspect-square w-3/4 -rotate-[9deg] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl bg-neutral-800 bg-contain p-8 text-center text-white shadow-2xl  shadow-neutral-900 hover:animate-wiggle md:w-1/4"
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
            className="flex aspect-square w-3/4 -rotate-[9deg] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl bg-neutral-800 bg-contain p-8 text-center  text-white shadow-2xl shadow-neutral-900 hover:animate-wiggle md:w-1/5 lg:w-1/4"
            style={{
              background: `url('/images/sticker_collage.png')`,
              backgroundSize: `100%`,
            }}
            href={`/fusion`}
          >
            <h1 className="rounded-lg  bg-neutral-900/70 p-2 text-2xl font-black lg:text-3xl">
              Fusion
            </h1>
            <h2 className="lg:text-md rounded-lg bg-neutral-900/70 p-2 text-sm font-semibold text-white">
              An NFT video collage creation tool
            </h2>
          </Link>
        </div>
      </main>
    </>
  );
}
