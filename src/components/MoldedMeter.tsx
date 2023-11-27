import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ORIGINAL_CLAY_SUPPLY } from "~/utils/constants";
import { api } from "~/utils/api";

export const MoldedMeter = () => {
  const clayBarRef = useRef<HTMLDivElement>(null);
  const [clayBarWidth, setClayBarWidth] = useState(0);

  const {
    data: clayCounts,
    isLoading,
    // refetch,
  } = api.stats.getMoldedMeterSnapshot.useQuery();

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

  useEffect(() => {
    updateClayBarWidth();
  }, [isLoading]);

  const totalClayMolded = clayCounts
    ? clayCounts?.black +
      clayCounts?.blue +
      clayCounts?.green +
      clayCounts?.red +
      clayCounts?.white +
      clayCounts?.yellow
    : 0;

  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="p-4 text-center font-clayno text-2xl hover:animate-wiggle md:text-4xl">
        <span className="text-green-400">Cl</span>
        <span className="mr-2 text-yellow-300">ay</span>
        <span className="ml-2 text-blue-400">Mo</span>
        <span className="text-red-500">ld</span>
        <span className="text-green-400">ed</span>
      </h1>
      {clayCounts && (
        <div className="flex flex-col gap-2 font-clayno md:container">
          <div className="flex cursor-pointer flex-row gap-2 hover:animate-pulse">
            <Image
              src="/images/red.png"
              width={40}
              height={40}
              alt="Red Clay"
              className="rounded-full"
            />
            <div
              className="items-centeroverflow-clip relative flex h-10 w-full items-center overflow-clip rounded-3xl bg-red-500/40"
              ref={clayBarRef}
            >
              <div
                className="h-full min-w-[60px] rounded-r-3xl bg-red-500"
                style={{
                  width: `${Math.floor(
                    ((ORIGINAL_CLAY_SUPPLY.red - clayCounts.red) /
                      ORIGINAL_CLAY_SUPPLY.red) *
                      clayBarWidth
                  )}px`,
                }}
              ></div>
              <p className="absolute left-4 text-lg font-extrabold">
                {ORIGINAL_CLAY_SUPPLY.red - clayCounts.red}
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
                {clayCounts.red}
              </p>
            </div>
          </div>
          <div className="flex cursor-pointer flex-row gap-2 hover:animate-pulse">
            <Image
              src="/images/green.png"
              width={40}
              height={40}
              alt="Green Clay"
              className="rounded-full"
            />
            <div className="relative flex h-10 w-full items-center overflow-clip rounded-3xl bg-green-500/40">
              <div
                className="h-full min-w-[60px] rounded-r-3xl bg-green-500"
                style={{
                  width: `${Math.floor(
                    ((ORIGINAL_CLAY_SUPPLY.green - clayCounts.green) /
                      ORIGINAL_CLAY_SUPPLY.green) *
                      clayBarWidth
                  )}px`,
                }}
              ></div>
              <p className="absolute left-4 text-lg font-extrabold">
                {ORIGINAL_CLAY_SUPPLY.green - clayCounts.green}
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
                {clayCounts.green}
              </p>
            </div>
          </div>
          <div className="flex cursor-pointer flex-row gap-2 hover:animate-pulse">
            <Image
              src="/images/yellow.png"
              width={40}
              height={40}
              alt="Yellow Clay"
              className="rounded-full"
            />
            <div className="relative flex h-10 w-full items-center overflow-clip rounded-3xl bg-amber-400/40">
              <div
                className="h-full min-w-[60px]  rounded-r-3xl bg-amber-400"
                style={{
                  width: `${Math.floor(
                    ((ORIGINAL_CLAY_SUPPLY.yellow - clayCounts.yellow) /
                      ORIGINAL_CLAY_SUPPLY.yellow) *
                      clayBarWidth
                  )}px`,
                }}
              ></div>
              <p className="absolute left-4 text-lg font-extrabold">
                {ORIGINAL_CLAY_SUPPLY.yellow - clayCounts.yellow}
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
                {clayCounts.yellow}
              </p>
            </div>
          </div>
          <div className="flex cursor-pointer flex-row gap-2 hover:animate-pulse">
            <Image
              src="/images/white.png"
              width={40}
              height={40}
              alt="White Clay"
              className="rounded-full"
            />
            <div className="relative flex h-10 w-full items-center overflow-clip rounded-3xl bg-gray-300/40">
              <div
                className="h-full min-w-[60px] rounded-r-3xl bg-gray-300"
                style={{
                  width: `${Math.floor(
                    ((ORIGINAL_CLAY_SUPPLY.white - clayCounts.white) /
                      ORIGINAL_CLAY_SUPPLY.white) *
                      clayBarWidth
                  )}px`,
                }}
              ></div>
              <p className="absolute left-4 text-lg font-extrabold">
                {ORIGINAL_CLAY_SUPPLY.white - clayCounts.white}
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
                {clayCounts.white}
              </p>
            </div>
          </div>
          <div className="flex cursor-pointer flex-row gap-2 hover:animate-pulse">
            <Image
              src="/images/blue.png"
              width={40}
              height={40}
              alt="Blue Clay"
              className="rounded-full"
            />
            <div className="relative flex h-10 w-full items-center overflow-clip rounded-3xl bg-blue-400/40">
              <div
                className="h-full min-w-[60px] rounded-r-3xl bg-blue-400"
                style={{
                  width: `${Math.floor(
                    ((ORIGINAL_CLAY_SUPPLY.blue - clayCounts.blue) /
                      ORIGINAL_CLAY_SUPPLY.blue) *
                      clayBarWidth
                  )}px`,
                }}
              ></div>
              <p className="absolute left-4 text-lg font-extrabold">
                {ORIGINAL_CLAY_SUPPLY.blue - clayCounts.blue}
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
                {clayCounts.blue}
              </p>
            </div>
          </div>
          <div className="flex cursor-pointer flex-row gap-2 hover:animate-pulse">
            <Image
              src="/images/black.png"
              width={40}
              height={40}
              alt="Black Clay"
              className="rounded-full"
            />
            <div className="relative flex h-10 w-full items-center overflow-clip rounded-3xl bg-neutral-700/60">
              <div
                className="h-full min-w-[60px] rounded-r-3xl bg-neutral-700"
                style={{
                  width: `${Math.floor(
                    ((ORIGINAL_CLAY_SUPPLY.black - clayCounts.black) /
                      ORIGINAL_CLAY_SUPPLY.black) *
                      clayBarWidth
                  )}px`,
                }}
              ></div>
              <p className="absolute left-4 text-lg font-extrabold">
                {ORIGINAL_CLAY_SUPPLY.black - clayCounts.black}
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
                {clayCounts.black}
              </p>
            </div>
          </div>
          <div className="flex cursor-pointer flex-row gap-2 hover:animate-pulse">
            <Image
              src="/images/rainbow.png"
              width={40}
              height={40}
              alt="Total"
              className="rounded-full"
            />
            <div className="relative flex h-10 w-full items-center overflow-clip rounded-3xl bg-gradient-to-r from-amber-400/40 from-10% via-blue-400/40 via-50% to-red-400/40 to-90%">
              <div
                className="h-full min-w-[60px] rounded-r-3xl bg-gradient-to-r from-red-500 from-20% via-blue-500 via-50%  to-amber-500 to-75%"
                style={{
                  width: `${Math.floor(
                    ((ORIGINAL_CLAY_SUPPLY.black - clayCounts.black) /
                      ORIGINAL_CLAY_SUPPLY.black) *
                      clayBarWidth
                  )}px`,
                }}
              ></div>
              <p className="absolute left-4 text-lg font-extrabold">
                {ORIGINAL_CLAY_SUPPLY.total - totalClayMolded}
              </p>
              <p className="absolute left-1/2 text-lg font-extrabold">
                {(
                  ((ORIGINAL_CLAY_SUPPLY.total - totalClayMolded) /
                    ORIGINAL_CLAY_SUPPLY.total) *
                  100
                ).toFixed(2)}
                %
              </p>
              <p className="absolute right-4 text-lg font-extrabold">
                {ORIGINAL_CLAY_SUPPLY.total -
                  (ORIGINAL_CLAY_SUPPLY.total - totalClayMolded)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
