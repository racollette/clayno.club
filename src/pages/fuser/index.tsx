"use client";

import React, { useRef, useState } from "react";
import Layout from "~/components/Layout";
import Image from "next/image";
import Head from "next/head";
import classnames from "classnames";
import { Slider as SliderBase } from "~/@/components/ui/slider";
import * as Slider from "@radix-ui/react-slider";
import sliderStyles from "./slider.module.css";
import DinoSlide from "~/components/DinoSlide";
import { HiXCircle } from "react-icons/hi";

import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";

// Import any actions required for transformations.
import { fill } from "@cloudinary/url-gen/actions/resize";
import ColorPicker from "~/components/ColorPicker";

type GridItemProps = {
  index: number;
  imageURL: string;
};

const updateGrid = (type: string, size: number, grid: GridItemProps[][]) => {
  const empty = { index: 0, imageURL: "" };
  const difference = size - (type === "col" ? grid[0].length : grid.length);

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

type AssetImageProps = {
  imageURL: string;
};

const ImageTest = ({ imageURL }: AssetImageProps) => {
  const cld = new Cloudinary({
    cloud: {
      cloudName: "dncw1tebs",
    },
  });
  // https://res.cloudinary.com/dncw1tebs/image/upload/v1693789077/docs/models.gif
  const myImage = cld.image("docs/models");

  // 4. Transform your image
  //=========================

  // Resize to 250 x 250 pixels using the 'fill' crop mode.
  myImage.resize(fill().width(250).height(250));

  const handleDragStart = (
    e: React.DragEvent<HTMLImageElement>,
    imageURL: string
  ) => {
    e.dataTransfer.setData("text/plain", imageURL);
  };

  return (
    // <Image
    //   src={imageURL}
    //   alt=""
    //   width={96}
    //   height={96}
    //   draggable="true"
    //   onDragStart={(e) => handleDragStart(e, e.currentTarget.src)}
    // />
    <AdvancedImage cldImg={myImage} />
  );
};

export default function FuserPage() {
  const [rows, setRows] = useState<number>(2);
  const [cols, setCols] = useState<number>(3);
  const [outlineWidth, setOutlineWidth] = useState<number>(2);
  const [color, setColor] = useState<string>("#aabbcc");

  const initialGrid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, (_, index) => ({
      index: index,
      imageURL: "",
    }))
  );
  const [grid, setGrid] = useState<GridItemProps[][]>(initialGrid);

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

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    e.preventDefault();

    // Get the dropped image's URL from the dataTransfer object
    const droppedImageUrl = e.dataTransfer.getData("text/plain");

    // Update the imageURL of the specific cell in the grid
    setGrid((prevGrid) =>
      prevGrid.map((row, rIndex) =>
        rIndex === rowIndex
          ? row.map((cell, cIndex) =>
              cIndex === colIndex
                ? { ...cell, imageURL: droppedImageUrl }
                : cell
            )
          : row
      )
    );
  };

  const handleClear = (rowIndex: number, colIndex: number) => {
    // Update the imageURL of the specific cell in the grid
    setGrid((prevGrid) =>
      prevGrid.map((row, rIndex) =>
        rIndex === rowIndex
          ? row.map((cell, cIndex) =>
              cIndex === colIndex ? { ...cell, imageURL: "" } : cell
            )
          : row
      )
    );
  };

  const handlePlace = (imageURL: string) => {
    let setItem = false;
    setGrid((prevGrid) =>
      prevGrid.map((row) =>
        row.map((cell) => {
          if (cell.imageURL === "" && !setItem) {
            setItem = true;
            return { ...cell, imageURL: imageURL };
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

  return (
    <>
      <Head>
        <title>DinoHerd | Fuser</title>
        <meta name="description" content="Claynosaurz Herd Showcase" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <section className="my-10 flex flex-col items-start justify-center gap-y-4">
          <div className="flex flex-row justify-center rounded-lg bg-stone-800 px-8 py-2">
            <button
              onClick={handleReset}
              className="rounded-lg bg-sky-700 px-3 py-1 hover:bg-sky-600"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-row items-start gap-x-4">
            <div className="flex flex-col items-center gap-y-4">
              <div
                className="grid"
                style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
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
                        className={`relative flex aspect-square ${
                          cols * rows > 36
                            ? `h-20 w-20`
                            : cols * rows > 24 || cols > 8
                            ? `h-28 w-28`
                            : cols * rows > 12 || cols > 6
                            ? `h-36 w-36`
                            : `h-48 w-48`
                        } cursor-grab items-center justify-center bg-stone-800 outline`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                      >
                        {item.imageURL ? (
                          <>
                            <Image
                              key={`${rowIndex}_${colIndex}`}
                              src={item.imageURL}
                              alt={`Dropped Image ${rowIndex}_${colIndex}`}
                              fill
                            />
                            <div
                              onClick={(e) => handleClear(rowIndex, colIndex)}
                              className="flex transform cursor-pointer items-center justify-center opacity-0 transition-opacity hover:opacity-100"
                            >
                              <HiXCircle size={50} />
                            </div>
                          </>
                        ) : (
                          <div>{gridCount}</div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* <div className="">
            <div>Rows</div>
            <Slider.Root
              onValueChange={(v) => handleSlideRows(v)}
              className={sliderStyles.SliderRoot}
              min={1}
              max={10}
              step={1}
              defaultValue={[2]}
              orientation="vertical"
            >
              <Slider.Track className={sliderStyles.SliderTrack}>
                <Slider.Range className={sliderStyles.SliderRange} />
              </Slider.Track>
              <Slider.Thumb className={sliderStyles.SliderThumb} />
            </Slider.Root>
          </div> */}
            <div className="flex flex-col justify-start gap-4 rounded-md bg-stone-800 p-6">
              <div className="flex flex-col gap-1">
                <div>Columns</div>
                <SliderBase
                  onValueChange={(v) => handleSlideColumns(v)}
                  defaultValue={[3]}
                  min={1}
                  max={10}
                  step={1}
                  className="w-48"
                />
              </div>
              <div className="flex flex-col gap-1">
                <div>Rows</div>
                <SliderBase
                  onValueChange={(v) => handleSlideRows(v)}
                  defaultValue={[2]}
                  min={1}
                  max={10}
                  step={1}
                  className="w-48"
                />
              </div>
              <div className="flex flex-col gap-1">
                <div>Border Width</div>
                <SliderBase
                  onValueChange={(v) => handleOutlineWidth(v)}
                  defaultValue={[2]}
                  min={0}
                  max={8}
                  step={1}
                  className="w-48"
                />
              </div>
              <div>
                <ColorPicker onChange={setColor} color={color} />
              </div>
            </div>
          </div>
        </section>
        <section>
          <DinoSlide handlePlace={handlePlace} />
        </section>
      </Layout>
    </>
  );
}
