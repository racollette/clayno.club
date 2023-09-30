"use client";

import React, { useCallback, useRef, useState } from "react";
import Layout from "~/components/Layout";
import Image from "next/image";
import Head from "next/head";
import DinoSlide from "~/components/DinoSlide";
import { HiXCircle } from "react-icons/hi";
import useFusion from "~/hooks/useFusion";
import { api } from "~/utils/api";
import { useUser } from "~/hooks/useUser";
import CollageModal from "~/components/CollageModal";
import { HiSave, HiBan, HiCog } from "react-icons/hi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/@/components/ui/tooltip";
import { useToast } from "~/@/components/ui/use-toast";
import { CollageSettings } from "~/components/CollageSettings";

type GridItemProps = {
  index: number;
  imageURL: string;
  motion: string;
  mint: string;
};

type EditableCollage = {
  rows: number;
  cols: number;
  borderWidth: number;
  borderColor: string;
  grid: GridItemProps[][];
};

const updateGrid = (type: string, size: number, grid: GridItemProps[][]) => {
  const empty = { index: 0, imageURL: "", motion: "", mint: "" };
  const cols = grid[0]?.length ?? 0;
  const difference = size - (type === "col" ? cols : grid.length);

  if (type === "row") {
    if (difference > 0) {
      grid.push(
        ...Array.from({ length: difference }, () =>
          new Array(grid[0]?.length).fill(empty)
        )
      );
    } else if (difference < 0) {
      grid.splice(size);
    }
    return grid;
  }

  for (let r = 0; r < grid.length; r++) {
    if (difference > 0) {
      grid[r]?.push(...Array.from({ length: difference }, () => empty));
    } else if (difference < 0) {
      grid[r]?.splice(size);
    }
  }

  return grid;
};

export default function FusionPage() {
  const { user, session } = useUser();
  const { toast } = useToast();
  const [rows, setRows] = useState<number>(2);
  const [cols, setCols] = useState<number>(3);
  const [outlineWidth, setOutlineWidth] = useState<number>(2);
  const [color, setColor] = useState<string>("#ffffff");
  const collageRef = useRef<HTMLDivElement>(null);
  const { doFusion, error } = useFusion();
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const saveCollage = api.fusion.saveCollage.useMutation();
  const [pulse, setPulse] = useState(false);

  const { data, isLoading, refetch } = api.fusion.getUserCollages.useQuery({
    userId: user?.id || "None",
  });

  const initialGrid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, (_, index) => ({
      index: index,
      imageURL: "",
      motion: "",
      mint: "",
    }))
  );
  const [grid, setGrid] = useState<GridItemProps[][]>(initialGrid);
  const gridFull = grid
    .flatMap((row) => row)
    .every(
      (cell) => cell.imageURL !== "" && cell.mint !== "" && cell.motion !== ""
    );

  const handleOutlineWidth = (v: number[]) => {
    if (v[0] === undefined) return;
    setOutlineWidth(v[0]);
  };

  const handleSlideRows = (v: number[]) => {
    if (!v[0]) return;
    const newRows = v[0];
    setGrid((prevGrid) => updateGrid("row", newRows, prevGrid));
    setRows(v[0]);
  };

  const handleSlideColumns = (v: number[]) => {
    if (!v[0]) return;
    const newCols = v[0];
    setGrid((prevGrid) => updateGrid("col", newCols, prevGrid));
    setCols(v[0]);
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLImageElement>,
    imageURL: string,
    motion: string,
    mint: string
  ) => {
    // e.dataTransfer.setData("text/plain", imageURL);
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        imageURL,
        motion,
        mint,
      })
    );
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    e.preventDefault();

    const customDataString = e.dataTransfer.getData("text/plain");
    const customData = JSON.parse(customDataString);

    // Access the individual data properties
    const imageURL = customData.imageURL;
    const motion = customData.motion;
    const mint = customData.mint;

    // Update the imageURL of the specific cell in the grid
    setGrid((prevGrid) =>
      prevGrid.map((row, rIndex) =>
        rIndex === rowIndex
          ? row.map((cell, cIndex) =>
              cIndex === colIndex
                ? {
                    ...cell,
                    imageURL,
                    mint,
                    motion,
                  }
                : cell
            )
          : row
      )
    );
  };

  const handleClear = useCallback((rowIndex: number, colIndex: number) => {
    // Update the imageURL of the specific cell in the grid
    setGrid((prevGrid) =>
      prevGrid.map((row, rIndex) =>
        rIndex === rowIndex
          ? row.map((cell, cIndex) =>
              cIndex === colIndex
                ? { ...cell, imageURL: "", motion: "", mint: "" }
                : cell
            )
          : row
      )
    );
  }, []);

  const handlePlace = (imageURL: string, motion: string, mint: string) => {
    let setItem = false;
    setGrid((prevGrid) =>
      prevGrid.map((row) =>
        row.map((cell) => {
          if (cell.imageURL === "" && !setItem) {
            setItem = true;
            return {
              ...cell,
              imageURL: imageURL,
              mint,
              motion,
            };
          }
          return { ...cell };
        })
      )
    );
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleReset = () => {
    setGrid(initialGrid);
  };

  let gridCount = 0;

  const handleSaveCollage = async () => {
    if (!user) return;

    console.log(grid);

    saveCollage.mutate({
      userId: user?.id,
      columns: cols,
      rows: rows,
      borderWidth: outlineWidth,
      borderColor: color,
      data: grid,
    });

    setPulse(true);
    toast({
      title: "Collage saved successfully",
    });

    setTimeout(async () => {
      refetch();
    }, 2000);

    setTimeout(async () => {
      setPulse(false);
    }, 10000);
  };

  const handleDownload = () => {
    if (videoBlob) {
      const url = URL.createObjectURL(videoBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "video.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleLoadCollage = (collage: EditableCollage) => {
    console.log(collage);
    const collageCopy = { ...collage };

    // setRows(collageCopy.rows);
    handleSlideRows([collageCopy.rows]);
    setCols(collageCopy.cols);
    setOutlineWidth(collageCopy.borderWidth);
    setColor(collageCopy.borderColor);
    setGrid([...collageCopy.grid]);
  };

  const handleFillCells = (mints: any, showPFP: boolean) => {
    let gridIndex = -1;
    setGrid((prevGrid) =>
      prevGrid.map((row) =>
        row.map((cell) => {
          console.log(gridIndex);
          gridIndex++;
          if (cell.imageURL === "") {
            return {
              ...cell,
              imageURL: showPFP ? mints[gridIndex].pfp : mints[gridIndex].gif,
              mint: mints[gridIndex].mint,
              motion: showPFP
                ? "PFP"
                : mints[gridIndex].attributes?.motion || "PFP",
            };
          }
          return { ...cell };
        })
      )
    );
  };

  const handleRecord = async (id: string) => {
    // const dataArray = convertToArray(grid);

    // console.log(dataArray);

    // const payload = {
    //   columns: cols,
    //   rows: rows,
    //   borderWidth: outlineWidth,
    //   borderColor: color,
    //   data: dataArray,
    // };

    try {
      const response = await doFusion(id);
      const { jobId } = response.data;

      // Check for successful response status
      if (response && response.status === 200) {
        // const videoData = response.data;
        // const blob = new Blob([videoData], { type: "video/mp4" });
        // setVideoBlob(blob);
        toast({
          title: "Job Request Submitted",
          description: `Job ID: ${jobId}`,
        });
      } else {
        throw new Error("Job submission failed.");
      }
    } catch (err) {
      console.error(err);
      // Handle errors
    }
  };

  return (
    <>
      <Head>
        <title>DinoHerd | Fusion</title>
        <meta name="description" content="Claynosaurz Herd Showcase" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <section
          className={`my-10 flex ${
            cols === 6
              ? `w-full lg:w-full xl:w-3/4`
              : cols === 5
              ? `w-full lg:w-5/6 xl:w-2/3`
              : cols === 4
              ? `w-full lg:w-4/5 xl:w-3/5`
              : cols === 3
              ? `w-full lg:w-4/5 xl:w-3/5 2xl:w-1/2`
              : cols === 2
              ? `w-full lg:w-1/2 xl:w-1/2 2xl:w-2/5`
              : `w-full lg:w-1/3 xl:w-1/3`
          } select-none flex-col items-start justify-center gap-y-4`}
        >
          <div className="flex flex-row justify-start gap-4 rounded-lg bg-neutral-800 px-4 py-2">
            <TooltipProvider>
              <CollageModal
                title="My Collages"
                content=""
                data={data}
                pulse={pulse}
                onLoad={handleLoadCollage}
                onRecord={handleRecord}
              />
              <Tooltip>
                <TooltipTrigger
                  className={`rounded-lg px-3 py-2 ${
                    !gridFull
                      ? "cursor-not-allowed bg-neutral-400 hover:bg-neutral-500"
                      : "cursor-pointer bg-cyan-600 hover:bg-cyan-500"
                  }`}
                  onClick={!gridFull ? undefined : handleSaveCollage}
                >
                  <HiSave size={24} />
                </TooltipTrigger>

                <TooltipContent>
                  <p>Save</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  onClick={handleReset}
                  className="rounded-lg bg-amber-500 px-3 py-2 hover:bg-amber-400"
                >
                  <HiBan size={24} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="block lg:hidden">
              <CollageSettings
                cols={cols}
                rows={rows}
                outlineWidth={outlineWidth}
                handleSlideColumns={handleSlideColumns}
                handleSlideRows={handleSlideRows}
                handleOutlineWidth={handleOutlineWidth}
                color={color}
                setColor={setColor}
                modalMode={true}
              />
            </div>

            {videoBlob && (
              <div>
                <p>Video Preview:</p>
                <video controls width="400">
                  <source
                    src={URL.createObjectURL(videoBlob)}
                    type="video/mp4"
                  />
                </video>
                <button onClick={handleDownload}>Download Video</button>
              </div>
            )}
          </div>
          <div className="flex w-full flex-row items-start gap-x-4">
            <div
              className="flex w-full flex-col items-center gap-y-4"
              ref={collageRef}
            >
              <div
                className={`grid w-full`}
                style={{
                  gridTemplateColumns: `repeat(${cols}, 1fr)`,
                  margin: `${outlineWidth}px`,
                }}
              >
                {grid.map((row, rowIndex) =>
                  row.map((item, colIndex) => {
                    gridCount++;
                    return (
                      <div
                        key={`${rowIndex}_${colIndex}`}
                        style={{
                          outlineWidth: `${outlineWidth}px`,
                          outlineColor: color,
                        }}
                        className={`relative box-border flex aspect-square cursor-grab items-center justify-center bg-neutral-800 outline  `}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
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
                              onDragStart={(e) =>
                                handleDragStart(
                                  e,
                                  e.currentTarget.src,
                                  item.motion,
                                  item.mint
                                )
                              }
                            />

                            <div
                              onClick={(e) => handleClear(rowIndex, colIndex)}
                              className="flex transform cursor-pointer items-center justify-center opacity-0 transition-opacity hover:opacity-100"
                            >
                              <HiXCircle size={50} />
                            </div>
                          </>
                        ) : (
                          <div className="aspect-square">
                            {gridCount}
                            {/* {item.index} */}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <div className="hidden lg:block">
              <CollageSettings
                cols={cols}
                rows={rows}
                outlineWidth={outlineWidth}
                handleSlideColumns={handleSlideColumns}
                handleSlideRows={handleSlideRows}
                handleOutlineWidth={handleOutlineWidth}
                color={color}
                setColor={setColor}
                modalMode={false}
              />
            </div>
          </div>
        </section>
        <section className="mt-48">
          <DinoSlide
            handlePlace={handlePlace}
            handleDragStart={handleDragStart}
            handleFillCells={handleFillCells}
          />
        </section>
      </Layout>
    </>
  );
}

function convertToArray(grid: GridItemProps[][]) {
  const dataArray: { motion: string; mint: string; imageURL: string }[] = [];
  grid.forEach((row: any) => {
    row.forEach((cell: any) => {
      // Check if the cell has values for imageURL, motion, and mint
      if (cell.imageURL && cell.motion && cell.mint) {
        dataArray.push({
          motion: cell.motion,
          mint: cell.mint,
          imageURL: cell.imageURL,
        });
      }
    });
  });

  return dataArray;
}