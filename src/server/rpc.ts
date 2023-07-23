import { Connection } from "@solana/web3.js";
import { env } from "~/env.mjs";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export const connection = new Connection(publicRuntimeConfig.myRPC);
