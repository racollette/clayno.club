import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { api } from "~/utils/api";
import { useWidth } from "~/hooks/useWidth";

type ClassItem = {
  Stego: number;
  Total: number;
  Trice: number;
  Bronto: number;
};

function getBgColor(species: string) {
  switch (species) {
    case "Stego":
      return "bg-red-400";
    case "Trice":
      return "bg-blue-400";
    case "Bronto":
      return "bg-amber-400";
    case "Ankylo":
      return "bg-purple-400";
    case "Rex":
      return "bg-green-500";
    case "Raptor":
      return "bg-pink-400";
  }
}

function calculateWidth(elementWidth: number, count: number, total: number) {
  return `${(count / total) * elementWidth * 0.925}px`;
}

export const ClassCounter = () => {
  const speciesBarRef = useRef<HTMLDivElement>(null);
  const containerWidth = useRef<HTMLDivElement>(null);
  const [topClass, setTopClass] = useState(0);
  const {
    data,
    // isLoading,
    // refetch,
  } = api.stats.getClassCountSnapshot.useQuery();

  const { elementWidth: classElementWidth } = useWidth(containerWidth);

  useEffect(() => {
    const largestTotal = findLargestTotal(data?.classes);
    setTopClass(largestTotal);
  }, [data]);

  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="p-4 text-center font-claynoShadow text-3xl md:text-5xl">
        <span className="text-green-500">Cl</span>
        <span className="text-blue-400">as</span>
        <span className="text-red-400">ses</span>
      </h1>
      <div
        className="container flex w-full flex-col items-center gap-8"
        ref={containerWidth}
      >
        {data &&
          (data.classes as Array<{ [key: string]: ClassItem }>)
            ?.sort((a, b) => {
              const keyA = Object.keys(a)[0];
              const keyB = Object.keys(b)[0];
              if (keyA && keyB) {
                const totalA = a[keyA]?.Total || 0;
                const totalB = b[keyB]?.Total || 0;
                return totalB - totalA;
              }
              return 0;
            })
            .map((classItem: { [key: string]: ClassItem }) => {
              const classType = Object.keys(classItem)[0];
              const speciesList = Object.values(classItem)[0];
              const total = speciesList?.Total as number;

              const speciesEntries = Object.entries(
                speciesList as { [key: string]: number }
              ).filter(([key]) => key !== "Total");

              return (
                <div
                  key={classType}
                  className="flex min-w-[60%] flex-row items-center self-start"
                  style={{
                    width: calculateWidth(
                      classElementWidth ?? 0,
                      speciesList?.Total as number,
                      topClass
                    ),
                  }}
                >
                  <div
                    className={`flex w-full flex-row items-center justify-center`}
                  >
                    <div
                      className="flex w-full flex-row overflow-hidden rounded-l-3xl"
                      ref={speciesBarRef}
                    >
                      {speciesEntries
                        .sort((a, b) => b[1] - a[1])
                        .map((species) => {
                          return (
                            <div
                              key={species[0]}
                              className={`flex min-w-fit flex-row items-center justify-center gap-1 px-4 font-clayno  ${getBgColor(
                                species[0]
                              )}`}
                              style={{
                                width: `${
                                  speciesList
                                    ? (species[1] / total) * 100
                                    : `33.333`
                                }%`,
                              }}
                            >
                              <p>{species[1]}</p>
                              <Image
                                src={`/icons/${species[0].toLowerCase()}_colored.svg`}
                                width={50}
                                height={50}
                                alt={`${species[0]} Icon`}
                              />
                              <p className="hidden md:block">{species[0]}</p>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <div className="flex h-[50px] flex-row items-center gap-2 bg-gray-300">
                    <p className="whitespace-nowrap px-4 text-right font-clayno text-black">
                      {total} {classType}s
                    </p>
                    <Image
                      src={`/images/${classType?.toLowerCase()}.png`}
                      width={75}
                      height={75}
                      alt={`Class ${classType} Placeholder`}
                    />
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

function findLargestTotal(data: any) {
  let largestTotal = 0;

  data &&
    data.forEach((classObj: any) => {
      // Assuming each object has only one key
      const classKey = Object.keys(classObj)[0] ?? "";
      const totalValue = classObj[classKey].Total;

      if (totalValue && totalValue > largestTotal) {
        largestTotal = totalValue;
      }
    });

  return largestTotal ?? 0;
}
