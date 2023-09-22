import { Prisma } from "@prisma/client";
import Image from "next/image";
import { Fragment, useRef } from "react";

type GridItemProps = {
  index: number;
  imageURL: string;
  motion: string;
  mint: string;
};

type CollageGridProps = {
  rows: number;
  cols: number;
  borderColor: string;
  borderWidth: number;
  grid: GridItemProps[][];
};

export const CollagePreview = (props: CollageGridProps) => {
  const { rows, cols, borderColor, borderWidth, grid } = props;
  const collageRef = useRef<HTMLDivElement>(null);
  let gridCount = 0;

  console.log(grid);
  // const gridArray: GridItemProps[][] = JSON.parse(JSON.stringify(grid));

  return (
    <div className="flex flex-col items-center gap-y-4" ref={collageRef}>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          margin: `${borderWidth}px`,
        }}
      >
        {grid.map((row, rowIndex) => (
          <Fragment key={rowIndex}>
            {row.map((item, colIndex) => {
              gridCount++;
              return (
                <div
                  key={`${rowIndex}_${colIndex}`}
                  style={{
                    outlineWidth: `${borderWidth}px`,
                    outlineColor: borderColor,
                  }}
                  className={`relative flex aspect-square ${
                    cols * rows > 36
                      ? `h-20 w-20`
                      : cols * rows > 24 || cols > 8
                      ? `h-28 w-28`
                      : cols * rows > 12 || cols > 6
                      ? `h-36 w-36`
                      : `h-48 w-48`
                  } box-border cursor-grab items-center justify-center bg-stone-800 outline`}
                  //   onDragOver={handleDragOver}
                  //   onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                >
                  {item.imageURL ? (
                    <>
                      <Image
                        key={`${rowIndex}_${colIndex}`}
                        src={
                          item.mint === "clayno_logo_vertical_1024x1024"
                            ? `${item.imageURL}`
                            : `https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${item.imageURL}`
                        }
                        alt={`Dropped Image ${rowIndex}_${colIndex}`}
                        fill
                        // onDragStart={(e) =>
                        //   handleDragStart(
                        //     e,
                        //     e.currentTarget.src,
                        //     item.motion,
                        //     item.mint
                        //   )
                        // }
                      />
                      <div
                        // onClick={(e) => handleClear(rowIndex, colIndex)}
                        className="flex transform cursor-pointer items-center justify-center opacity-0 transition-opacity hover:opacity-100"
                      >
                        {/* <HiXCircle size={50} /> */}
                      </div>
                    </>
                  ) : (
                    <div>{gridCount}</div>
                  )}
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
