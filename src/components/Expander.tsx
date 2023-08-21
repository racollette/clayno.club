import { Dino, Attributes } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { getRarityColor } from "~/utils/colors";
import { TraitHover } from "./TraitHover";

type ImageExpanderProps = {
  dinos: Dino[] & { attributes: Attributes }[];
  expanded: boolean;
};

const ImageExpander = ({ dinos, expanded }: ImageExpanderProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const dinoIndex = dinos.findIndex(
    (dino: any) =>
      dino?.attributes?.species !== "Spino" &&
      dino?.attributes?.species !== "Para"
  );
  const firstDino = dinos[dinoIndex] ?? dinos[0];

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={`${
        expanded && "max-h-full"
      } transition-max-height duration-750 overflow-hidden ease-in-out`}
    >
      {!expanded && firstDino ? (
        <div
          className={`relative aspect-square overflow-clip rounded-md`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Image
            src={`https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${firstDino.gif}`}
            alt={firstDino.name}
            fill
            quality={50}
          />
          {isHovered && (
            <>
              <div
                className={`absolute right-1 top-1 rounded-md px-2 py-1 text-xs text-white ${getRarityColor(
                  firstDino.rarity || 0
                )}`}
              >
                {firstDino.rarity}
              </div>
              <div
                className={`absolute bottom-1 right-1 rounded-md bg-black px-2 py-1 text-xs text-white`}
              >
                {firstDino.name.split(" ").pop()}
              </div>
              {/* <div
                className={`right-left absolute top-1 rounded-md px-2 py-1 text-xs text-white`}
              >
                <TraitHover attributes={firstDino?.attributes} />
              </div> */}
            </>
          )}
        </div>
      ) : (
        <div
          className={`relative grid w-full grid-cols-2 justify-center gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`}
        >
          {dinos.map((dino: any, index: number) => (
            <ImageContainer key={index} item={dino} />
          ))}
        </div>
      )}
    </div>
  );
};

const ImageContainer = ({ item }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={`relative aspect-square overflow-clip rounded-md ${
        (item.attributes?.species === "Spino" ||
          item.attributes?.species === "Para") &&
        `order-last`
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        src={`https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${
          !item.attributes ? item.gif : isHovered ? item.pfp : item.gif
        }`}
        alt={item.name}
        fill
        quality={50}
      />
      {isHovered && (
        <>
          <div
            className={`absolute right-1 top-1 rounded-md px-2 py-1 text-xs text-white ${getRarityColor(
              item?.rarity || 9000
            )}`}
          >
            {item.rarity}
          </div>
          <div
            className={`absolute bottom-1 right-1 rounded-md bg-black px-2 py-1 text-xs text-white`}
          >
            {item.name.split(" ").pop()}
          </div>
          {item.attributes && (
            <div
              className={`right-left absolute top-1 z-20 rounded-md px-2 py-1 text-xs text-white`}
            >
              <TraitHover attributes={item.attributes} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImageExpander;
