import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ORIGINAL_CLAYMAKER_SUPPLY } from "~/utils/constants";
import { api } from "~/utils/api";

const MakerMeter = () => {
  const clayBarRef = useRef<HTMLDivElement>(null);
  const [clayBarWidth, setClayBarWidth] = useState(0);

  const {
    data: claymakerCounts,
    isLoading,
    // refetch,
  } = api.stats.getMakerChargesSnapshot.useQuery();

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

  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="p-4 text-center font-clayno text-3xl hover:animate-wiggle md:text-4xl">
        <span className="text-teal-400">Ma</span>
        <span className="mr-2 text-amber-500">ker</span>
        <span className="ml-2 text-purple-400">Ch</span>
        <span className=" text-amber-500">ar</span>
        <span className="text-teal-400">ges</span>
      </h1>
      {claymakerCounts && (
        <>
          <div className="flex flex-col gap-2 font-clayno md:container">
            <div className="flex cursor-pointer flex-row gap-2 hover:animate-pulse">
              <Image
                src="/images/first_claymaker.gif"
                width={40}
                height={40}
                alt="First Edition Claymaker"
                className="rounded-full"
              />
              <div
                className="relative flex h-10 w-full items-center overflow-clip rounded-3xl  bg-teal-500/50"
                ref={clayBarRef}
              >
                <div
                  className="h-full min-w-[60px] rounded-r-3xl bg-teal-500"
                  style={{
                    width: `${Math.floor(
                      ((ORIGINAL_CLAYMAKER_SUPPLY.first -
                        claymakerCounts.first) /
                        ORIGINAL_CLAYMAKER_SUPPLY.first) *
                        clayBarWidth
                    )}px`,
                  }}
                ></div>
                <p className="absolute left-4 text-lg font-extrabold">
                  {ORIGINAL_CLAYMAKER_SUPPLY.first - claymakerCounts.first}
                </p>
                <p className="absolute left-1/2  text-lg font-extrabold">
                  {(
                    ((ORIGINAL_CLAYMAKER_SUPPLY.first - claymakerCounts.first) /
                      ORIGINAL_CLAYMAKER_SUPPLY.first) *
                    100
                  ).toFixed(2)}
                  %
                </p>

                <p className="absolute right-4 text-lg font-extrabold">
                  {claymakerCounts.first}
                </p>
              </div>
            </div>
            <div className="flex cursor-pointer flex-row gap-2 hover:animate-pulse">
              <Image
                src="/images/deluxe_claymaker.gif"
                width={40}
                height={40}
                alt="Deluxe Edition Claymaker"
                className="rounded-full"
              />
              <div
                className="items-centeroverflow-clip relative flex h-10 w-full items-center overflow-clip rounded-3xl  bg-purple-500/50"
                ref={clayBarRef}
              >
                <div
                  className="h-full min-w-[60px] rounded-r-3xl bg-purple-500"
                  style={{
                    width: `${Math.floor(
                      ((ORIGINAL_CLAYMAKER_SUPPLY.deluxe -
                        claymakerCounts.deluxe) /
                        ORIGINAL_CLAYMAKER_SUPPLY.deluxe) *
                        clayBarWidth
                    )}px`,
                  }}
                ></div>
                <p className="absolute left-4 text-lg font-extrabold">
                  {claymakerCounts.deluxe * 5 - claymakerCounts.deluxeCharges}
                </p>
                <p className="absolute left-1/2  text-lg font-extrabold">
                  {(
                    ((claymakerCounts.deluxe * 5 -
                      claymakerCounts.deluxeCharges) /
                      claymakerCounts.deluxeCharges) *
                    100
                  ).toFixed(2)}
                  %
                </p>

                <p className="absolute right-4 text-lg font-extrabold">
                  {claymakerCounts.deluxe * 5}
                </p>
              </div>
            </div>
            <div className="flex cursor-pointer flex-row gap-2 hover:animate-pulse">
              <Image
                src="/images/limited_claymaker.gif"
                width={40}
                height={40}
                alt="Limited Edition Claymaker"
                className="rounded-full"
              />
              <div
                className="items-centeroverflow-clip relative flex h-10 w-full items-center overflow-clip rounded-3xl bg-amber-400/50"
                ref={clayBarRef}
              >
                <div
                  className="h-full min-w-[60px] rounded-r-3xl"
                  style={{
                    width: `${Math.floor(
                      ((ORIGINAL_CLAYMAKER_SUPPLY.limited -
                        claymakerCounts.limited) /
                        ORIGINAL_CLAYMAKER_SUPPLY.limited) *
                        clayBarWidth
                    )}px`,
                  }}
                ></div>
                <p className="absolute left-4 text-lg font-extrabold">
                  {/* {ORIGINAL_CLAYMAKER_SUPPLY.limited - claymakerCounts.limited} */}
                  {claymakerCounts.limited}
                </p>
                <p className="absolute right-4 text-xl font-extrabold">∞</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MakerMeter;
