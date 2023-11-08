import Layout from "~/components/Layout";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Starting Counts
// Red -- 4942
// Green -- 5132
// Blue -- 5221
// Black -- 4973
// Yellow -- 5117
// White -- 5630
// Gold -- 5
// Total: 31020

const ORIGINAL_CLAY_SUPPLY = {
  red: 4942,
  green: 5132,
  blue: 5221,
  black: 4973,
  yellow: 5117,
  white: 5630,
};

const clayCounts = {
  red: 4313,
  green: 3566,
  blue: 4535,
  black: 3765,
  yellow: 3846,
  white: 4170,
};

export default function StatsPage() {
  const clayBarRef = useRef<HTMLDivElement>(null);
  const [clayBarWidth, setClayBarWidth] = useState(0);

  const updateClayBarWidth = () => {
    if (clayBarRef.current) {
      setClayBarWidth(clayBarRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    // Initial update
    updateClayBarWidth();

    // Listen for the window resize event
    window.addEventListener("resize", updateClayBarWidth);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", updateClayBarWidth);
    };
  }, []);

  return (
    <>
      <Head>
        <title>DinoHerd | Stats</title>
      </Head>
      <Layout>
        <section className="flex w-full flex-col items-center justify-center gap-8 py-4 md:flex-row md:items-start md:px-4 md:py-8">
          <div className="flex w-full flex-col gap-2">
            <h1 className="p-4 text-center font-claynoShadow text-3xl md:text-5xl">
              <span className="text-amber-400">Mo</span>
              <span className="text-green-400">ld</span>
              <span className="mr-2 text-blue-400">ed</span>
              <span className="ml-2 text-gray-300">Me</span>
              <span className="text-red-500">ter</span>
            </h1>
            <div className="flex flex-row gap-2">
              <Image
                src="/images/Red.png"
                width={40}
                height={40}
                alt="Red Clay"
                className="rounded-full"
              />
              <div
                className="relative flex h-10 w-full items-center rounded-3xl border-2 border-red-500"
                ref={clayBarRef}
              >
                <div
                  className="h-full rounded-l-3xl rounded-r-3xl bg-red-500"
                  style={{
                    width: `${Math.floor(
                      ((ORIGINAL_CLAY_SUPPLY.red - clayCounts.red) /
                        ORIGINAL_CLAY_SUPPLY.red) *
                        clayBarWidth
                    )}px`,
                  }}
                ></div>
                <p className="absolute left-4 text-lg font-extrabold">
                  {clayCounts.red}
                </p>
                <p className="absolute left-1/2  text-lg font-extrabold">
                  {(
                    ((ORIGINAL_CLAY_SUPPLY.red - clayCounts.red) /
                      ORIGINAL_CLAY_SUPPLY.red) *
                    100
                  ).toFixed(2)}
                  %
                </p>

                <p className="absolute right-4 text-lg font-extrabold">
                  {ORIGINAL_CLAY_SUPPLY.red}
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <Image
                src="/images/Green.png"
                width={40}
                height={40}
                alt="Green Clay"
                className="rounded-full"
              />
              <div className="relative flex h-10 w-full items-center rounded-3xl border-2 border-green-500">
                <div
                  className="h-full rounded-l-3xl rounded-r-3xl bg-green-500"
                  style={{
                    width: `${Math.floor(
                      ((ORIGINAL_CLAY_SUPPLY.green - clayCounts.green) /
                        ORIGINAL_CLAY_SUPPLY.green) *
                        clayBarWidth
                    )}px`,
                  }}
                ></div>
                <p className="absolute left-4 text-lg font-extrabold">
                  {clayCounts.green}
                </p>
                <p className="absolute left-1/2  text-lg font-extrabold">
                  {(
                    ((ORIGINAL_CLAY_SUPPLY.green - clayCounts.green) /
                      ORIGINAL_CLAY_SUPPLY.green) *
                    100
                  ).toFixed(2)}
                  %
                </p>
                <p className="absolute right-4 text-lg font-extrabold">
                  {ORIGINAL_CLAY_SUPPLY.green}
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <Image
                src="/images/Yellow.png"
                width={40}
                height={40}
                alt="Yellow Clay"
                className="rounded-full"
              />
              <div className="relative flex h-10 w-full items-center rounded-3xl border-2 border-amber-400">
                <div
                  className="h-full rounded-l-3xl rounded-r-3xl bg-amber-400"
                  style={{
                    width: `${Math.floor(
                      ((ORIGINAL_CLAY_SUPPLY.yellow - clayCounts.yellow) /
                        ORIGINAL_CLAY_SUPPLY.yellow) *
                        clayBarWidth
                    )}px`,
                  }}
                ></div>
                <p className="absolute left-4 text-lg font-extrabold">
                  {clayCounts.yellow}
                </p>
                <p className="absolute left-1/2 text-lg font-extrabold">
                  {(
                    ((ORIGINAL_CLAY_SUPPLY.yellow - clayCounts.yellow) /
                      ORIGINAL_CLAY_SUPPLY.yellow) *
                    100
                  ).toFixed(2)}
                  %
                </p>
                <p className="absolute right-4 text-lg font-extrabold">
                  {ORIGINAL_CLAY_SUPPLY.yellow}
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <Image
                src="/images/White.png"
                width={40}
                height={40}
                alt="White Clay"
                className="rounded-full"
              />
              <div className="relative flex h-10 w-full items-center rounded-3xl border-2 border-gray-300">
                <div
                  className="h-full rounded-l-3xl rounded-r-3xl bg-gray-300"
                  style={{
                    width: `${Math.floor(
                      ((ORIGINAL_CLAY_SUPPLY.white - clayCounts.white) /
                        ORIGINAL_CLAY_SUPPLY.white) *
                        clayBarWidth
                    )}px`,
                  }}
                ></div>
                <p className="absolute left-4 text-lg font-extrabold">
                  {clayCounts.white}
                </p>
                <p className="absolute left-1/2 text-lg font-extrabold">
                  {(
                    ((ORIGINAL_CLAY_SUPPLY.white - clayCounts.white) /
                      ORIGINAL_CLAY_SUPPLY.white) *
                    100
                  ).toFixed(2)}
                  %
                </p>
                <p className="absolute right-4 text-lg font-extrabold">
                  {ORIGINAL_CLAY_SUPPLY.white}
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <Image
                src="/images/Blue.png"
                width={40}
                height={40}
                alt="Blue Clay"
                className="rounded-full"
              />
              <div className="relative flex h-10 w-full items-center rounded-3xl border-2 border-blue-400">
                <div
                  className="h-full rounded-l-3xl rounded-r-3xl bg-blue-400"
                  style={{
                    width: `${Math.floor(
                      ((ORIGINAL_CLAY_SUPPLY.blue - clayCounts.blue) /
                        ORIGINAL_CLAY_SUPPLY.blue) *
                        clayBarWidth
                    )}px`,
                  }}
                ></div>
                <p className="absolute left-4 text-lg font-extrabold">
                  {clayCounts.blue}
                </p>
                <p className="absolute left-1/2 text-lg font-extrabold">
                  {(
                    ((ORIGINAL_CLAY_SUPPLY.blue - clayCounts.blue) /
                      ORIGINAL_CLAY_SUPPLY.blue) *
                    100
                  ).toFixed(2)}
                  %
                </p>
                <p className="absolute right-4 text-lg font-extrabold">
                  {ORIGINAL_CLAY_SUPPLY.blue}
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <Image
                src="/images/Black.png"
                width={40}
                height={40}
                alt="Black Clay"
                className="rounded-full"
              />
              <div className="relative flex h-10 w-full items-center rounded-3xl border-2 border-neutral-700">
                <div
                  className="h-full rounded-l-3xl rounded-r-3xl bg-neutral-700"
                  style={{
                    width: `${Math.floor(
                      ((ORIGINAL_CLAY_SUPPLY.black - clayCounts.black) /
                        ORIGINAL_CLAY_SUPPLY.black) *
                        clayBarWidth
                    )}px`,
                  }}
                ></div>
                <p className="absolute left-4 text-lg font-extrabold">
                  {clayCounts.black}
                </p>
                <p className="absolute left-1/2 text-lg font-extrabold">
                  {(
                    ((ORIGINAL_CLAY_SUPPLY.black - clayCounts.black) /
                      ORIGINAL_CLAY_SUPPLY.black) *
                    100
                  ).toFixed(2)}
                  %
                </p>
                <p className="absolute right-4 text-lg font-extrabold">
                  {ORIGINAL_CLAY_SUPPLY.black}
                </p>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
