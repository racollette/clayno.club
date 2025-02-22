import { generateReactHelpers } from "@uploadthing/react";
import { generateUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "~/server/uploadthing";

export const UploadButton = generateUploadButton<OurFileRouter>();

export const { useUploadThing } = generateReactHelpers<OurFileRouter>();
