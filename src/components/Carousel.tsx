import React, { useState } from "react";
import Image from "next/image";
import { Dino } from "@prisma/client";
import { Carousel } from "flowbite-react";

const ImageCarousel = ({ items }: any) => {
  console.log(items);
  return (
    <Carousel className="h-56 w-56" indicators={false}>
      {items.map((dino: Dino, index: number) => (
        // <div className="relative m-0.5 h-40 w-40 overflow-clip rounded-md md:h-56 md:w-56">
        <Image
          src={dino.gif}
          alt={dino.name}
          quality={100}
          height={40}
          width={40}
          className="aspect-square"
        />
        // </div>
      ))}
    </Carousel>
  );
};

export default ImageCarousel;
