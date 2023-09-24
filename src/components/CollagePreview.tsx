import Image from "next/image";
import { Fragment, useRef } from "react";
import { HiTrash, HiPencilAlt, HiVideoCamera } from "react-icons/hi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/@/components/ui/tooltip";

type GridItemProps = {
  index: number;
  imageURL: string;
  motion: string;
  mint: string;
};

type CollageGridProps = {
  id: string;
  rows: number;
  cols: number;
  borderColor: string;
  borderWidth: number;
  grid: GridItemProps[][];
  onDelete: (event: React.MouseEvent<SVGElement>, id: string) => void;
  onLoad: (collage: any) => void;
  onRecord: (id: string) => void;
};

export const CollagePreview = (props: CollageGridProps) => {
  const {
    rows,
    cols,
    borderColor,
    borderWidth,
    grid,
    id,
    onDelete,
    onLoad,
    onRecord,
  } = props;
  const collageRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col items-center pr-4" ref={collageRef}>
      <div
        className="relative grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          margin: `${borderWidth}px`,
        }}
      >
        {grid.map((row, rowIndex) => (
          <Fragment key={rowIndex}>
            {row.map((item, colIndex) => {
              return (
                <div
                  key={`${rowIndex}_${colIndex}`}
                  style={{
                    outlineWidth: `${borderWidth}px`,
                    outlineColor: borderColor,
                  }}
                  className={`relative flex aspect-square ${
                    cols * rows >= 36
                      ? `h-10 w-10`
                      : cols * rows >= 24 || cols >= 8
                      ? `h-14 w-14`
                      : cols * rows >= 12 || cols >= 6
                      ? `h-18 w-18`
                      : `h-24 w-24`
                  } box-border items-center justify-center bg-stone-800 outline`}
                >
                  {item.imageURL && (
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
                      />
                    </>
                  )}
                </div>
              );
            })}
          </Fragment>
        ))}
        <div
          className={`absolute left-1/2 top-1/2 flex ${
            cols < 2 ? `flex-col` : `flex-row`
          } h-full w-full -translate-x-1/2 -translate-y-1/2 transform  items-center justify-center ${
            cols < 3 ? `gap-4` : `gap-12`
          } opacity-0 transition-opacity hover:opacity-100`}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HiPencilAlt
                  className="cursor-pointer rounded-full bg-yellow-400/75 p-2"
                  color="black"
                  size={50}
                  onClick={(e) =>
                    onLoad({
                      rows,
                      cols,
                      borderColor,
                      borderWidth,
                      grid,
                    })
                  }
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs font-semibold">Load</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <HiVideoCamera
                  className="cursor-pointer rounded-full bg-amber-700/75 p-2"
                  color="black"
                  size={50}
                  onClick={(e) => onRecord(id)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs font-semibold">Create Video</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <HiTrash
                  className="cursor-pointer rounded-full bg-red-700/75 p-2"
                  color="black"
                  size={50}
                  onClick={(e) => onDelete(e, id)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs font-semibold">Delete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};
