"use client";

import React, { useRef, useState } from "react";
import Layout from "~/components/Layout";
import Image from "next/image";
import Head from "next/head";
import classnames from "classnames";
import { Slider as SliderBase } from "~/@/components/ui/slider";
import * as Slider from "@radix-ui/react-slider";
import sliderStyles from "./slider.module.css";

type GridItemProps = {
  index: number;
  imageURL: string;
};

const initialGrid = (columns: number, rows: number) => {
  const grid = [];
  for (let i = 0; i < columns * rows; i++) {
    grid.push({ index: i, imageURL: "" });
  }
  return grid;
};

const updateGrid = (
  grid: GridItemProps[],
  currentColumns: number,
  currentRows: number,
  newColumns: number,
  newRows: number
) => {
  const updatedGrid: GridItemProps[] = [];

  // Loop through the new number of rows and columns
  for (let i = 0; i < newColumns * newRows; i++) {
    // Calculate the corresponding index in the current grid
    const currentRowIndex = Math.floor(i / currentColumns);
    const currentColIndex = i % currentColumns;
    const currentGridIndex = currentRowIndex * currentColumns + currentColIndex;

    if (i < grid.length) {
      // If the index is within the existing grid size, keep the existing data
      const data = grid[currentGridIndex];
      if (data) {
        updatedGrid.push(data);
      }
    } else {
      // If the index is beyond the existing grid size, add new data
      updatedGrid.push({ index: i, imageURL: "" });
    }
  }

  return updatedGrid;
};

type AssetImageProps = {
  imageURL: string;
};

const ImageTest = ({ imageURL }: AssetImageProps) => {
  const handleDragStart = (
    e: React.DragEvent<HTMLImageElement>,
    imageURL: string
  ) => {
    e.dataTransfer.setData("text/plain", imageURL);
  };

  return (
    <Image
      src={imageURL}
      alt=""
      width={96}
      height={96}
      draggable="true"
      onDragStart={(e) => handleDragStart(e, e.currentTarget.src)}
    />
  );
};

export default function FuserPage() {
  // const dragUrl = useRef();
  // const stageRef = useRef();
  const slider = useRef();
  const [rows, setRows] = useState<number>(2);
  const [cols, setCols] = useState<number>(3);

  console.log(rows);
  console.log(cols);

  const [grid, setGrid] = useState<GridItemProps[]>(initialGrid(cols, rows));
  // const [images, setImages] = useState([]);
  const [droppedImages, setDroppedImages] = useState<string[]>();

  const handleSlideRows = (v: number[]) => {
    if (!v[0]) return;
    setGrid((prevGrid) => updateGrid(prevGrid, cols, rows, cols, v[0] ?? rows));

    setRows(v[0]);
  };

  const handleSlideColumns = (v: number[]) => {
    if (!v[0]) return;
    setGrid((prevGrid) => updateGrid(prevGrid, cols, rows, v[0] ?? cols, rows));

    setCols(v[0]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();

    // Get the dropped image's URL from the dataTransfer object
    const droppedImageUrl = e.dataTransfer.getData("text/plain");
    // setDroppedImages((prevImages) => [...prevImages, droppedImageUrl]);
    setGrid((prevGrid) =>
      prevGrid.map((item) =>
        item.index === index ? { ...item, imageURL: droppedImageUrl } : item
      )
    );
  };

  return (
    <>
      <Head>
        <title>DinoHerd | Fuser</title>
        <meta name="description" content="Claynosaurz Herd Showcase" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <section className="flex flex-row items-center justify-center gap-x-8">
          <div className="flex flex-col items-center gap-y-4">
            <div className="flex flex-row">
              <ImageTest
                imageURL={
                  "https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/https://nftstorage.link/ipfs/bafybeiaknhrblb6ss4ds7fxzlrvg2zkvr2dfjq4adde73ykxjj3nnh6fju/3410.gif"
                }
              />
              <ImageTest
                imageURL={
                  "https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/https://nftstorage.link/ipfs/bafybeiai4m34547vw7gegj3zzxtwjkovualbeuaiwknnjx5vjifh5ghofe/9078.gif"
                }
              />
              <ImageTest
                imageURL={
                  "https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/https://nftstorage.link/ipfs/bafybeia44fro6wzbakusvilso6775yvgnlwaqdxebvek2uiudffnvuknqi/8865.gif"
                }
              />
            </div>
            <div
              className={classnames("grid", "gap-2")}
              style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
            >
              {/* {Array.from({ length: rows * cols }).map((_, index) => (
                <div
                  key={index}
                  className="flex h-32 w-32 items-center justify-center bg-stone-800"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  {index + 1}
                  {droppedImages.map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Dropped Image ${index}`}
                    />
                  ))}
                </div>
              ))} */}
              {grid.map((item, index) => {
                console.log(item);
                return (
                  <div
                    key={index}
                    className="relative flex h-32 w-32 items-center justify-center bg-stone-800"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    {item.imageURL ? (
                      <Image
                        key={index}
                        src={item.imageURL}
                        alt={`Dropped Image ${index}`}
                        fill
                      />
                    ) : (
                      <div>{index + 1}</div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col gap-1">
              <SliderBase
                onValueChange={(v) => handleSlideColumns(v)}
                defaultValue={[3]}
                min={2}
                max={8}
                step={1}
                className="w-48"
              />
            </div>
            <div>Columns</div>
          </div>
          <div className="">
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
          </div>
        </section>
      </Layout>
    </>
  );
}
