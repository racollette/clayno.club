import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { api } from "~/utils/api";

export const ClassCounter = () => {
  const {
    data: classCounts,
    // isLoading,
    // refetch,
  } = api.stats.getClassCountSnapshot.useQuery();

  console.log(classCounts);

  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="p-4 text-center font-claynoShadow text-3xl md:text-5xl">
        <span className="text-red-500">Cl</span>
        <span className="text-blue-400">as</span>
        <span className="text-yellow-300">ses</span>
      </h1>
    </div>
  );
};
