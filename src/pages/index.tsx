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
            className="h-[5000px] w-[5000px] animate-homepage-dino-pattern bg-repeat"
          ></div>
        </div>
        <div className="z-10 flex w-full flex-col items-center justify-around gap-10 md:flex-row">
          <Link
            className="flex aspect-square w-1/3 -rotate-[9deg] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl bg-neutral-800 bg-contain p-8 text-center text-white  shadow-2xl shadow-neutral-900 hover:animate-wiggle md:w-1/5"
            style={{
              background: `url('/gifs/guesty_herd.mp4')`,
              // backgroundSize: `100%`,
            }}
            href={`/herds`}
          >
            <h1 className="rounded-lg  bg-neutral-900/70 p-2 text-3xl font-black">
              Herds
            </h1>
            <h2 className="rounded-lg bg-neutral-900/70 p-2 text-sm text-white">
              Collectors Gallery
            </h2>
          </Link>
          <Link
            className="flex aspect-square w-1/3 -rotate-[9deg] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl bg-neutral-800 p-8 text-center text-white shadow-2xl shadow-neutral-900  hover:animate-wiggle md:w-1/5"
            style={{ background: `url('/images/tribes_banner.png')` }}
            href={`/tribes`}
          >
            <h1 className="rounded-lg  bg-neutral-900/70 p-2 text-3xl font-black">
              Tribes
            </h1>
            <h2 className="rounded-lg bg-neutral-900/70 p-2 text-sm text-white">
              Sub-Communities within the world of Claynotopia!
            </h2>
          </Link>
          <Link
            className="flex aspect-square w-1/3 -rotate-[9deg] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl bg-neutral-800 bg-contain p-8 text-center  text-white shadow-2xl shadow-neutral-900 hover:animate-wiggle md:w-1/5"
            style={{
              background: `url('/images/sticker_collage.png')`,
              backgroundSize: `100%`,
            }}
            href={`/fusion`}
          >
            <h1 className="rounded-lg  bg-neutral-900/70 p-2 text-3xl font-black">
              Fusion
            </h1>
            <h2 className="rounded-lg bg-neutral-900/70 p-2 text-sm text-white">
              A dino NFT video collage generation tool
            </h2>
          </Link>
        </div>
      </main>
    </>
  );
}
