// @ts-nocheck

import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import { PublicKey, Transaction } from "@solana/web3.js";
import { prisma } from "~/server/db";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken, getSession, useSession } from "next-auth/react";
import { SigninMessage } from "../utils/SigninMessage";
import DiscordProvider from "next-auth/providers/discord";
import TwitterProvider from "next-auth/providers/twitter";

import { env } from "~/env.mjs";
import { userAgent } from "next/server";
import { profile } from "console";

// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        session.user.profile = token.profile;
        if (token?.profile?.data) {
          session.user.name = token.profile.data.username;
        } else {
          session.user.name = token?.profile?.username;
        }
      }
      if (token.account.type === "credentials") {
        session.user.name = token.sub;
        session.user.image = `https://ui-avatars.com/api/?name=${token.sub}&background=random`;
      }
      return session;
    },
    async jwt({ token, account, profile }) {
      console.log(profile);
      if (account) {
        token.account = account;
      }
      if (profile) {
        token.profile = profile;
      }
      return Promise.resolve(token);
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    TwitterProvider({
      clientId: env.TWITTER_CLIENT_ID,
      clientSecret: env.TWITTER_CLIENT_SECRET,
      version: "2.0",
    }),
    CredentialsProvider({
      id: "signMessage",
      name: "Solana",
      credentials: {
        message: {
          label: "Message",
          type: "text",
        },
        signature: {
          label: "Signature",
          type: "text",
        },
      },
      async authorize(credentials, req) {
        try {
          const signinMessage = new SigninMessage(
            JSON.parse(credentials?.message || "{}")
          );

          // @ts-ignore
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL);
          if (signinMessage.domain !== nextAuthUrl.host) {
            return null;
          }

          const csrfToken = await getCsrfToken({ req: { ...req, body: null } });

          if (signinMessage.nonce !== csrfToken) {
            return null;
          }

          const validationResult = await signinMessage.validate(
            credentials?.signature || ""
          );

          if (!validationResult)
            throw new Error("Could not validate the signed message");

          console.log("HIIIIIIIIIIIIIIIIIIIIIII");
          // Check if user exists
          let user = await prisma.wallet.findUnique({
            where: {
              address: signinMessage.publicKey,
            },
          });

          // let user = false;

          console.log("hi", user);

          // Create new user if doesn't exist
          if (!user) {
            user = await prisma.user.create({
              data: {
                defaultAddress: signinMessage.publicKey,
                wallets: {
                  create: { address: signinMessage.publicKey },
                },
              },
            });
            // create account
            await prisma.account.create({
              data: {
                userId: user.id,
                type: "credentials",
                provider: "Ethereum",
                providerAccountId: signinMessage.publicKey,
              },
            });
          }

          return {
            id: signinMessage.publicKey,
          };
        } catch (e) {
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: "sendMemo",
      name: "Solana Ledger",
      credentials: {
        valid: {
          label: "Valid Signature",
          type: "text",
        },
        address: {
          label: "Public Key",
          type: "text",
        },
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.valid)
            throw new Error("Could not validate the signed message");

          // Check if user exists
          let user = await prisma.user.findUnique({
            where: {
              address: credentials?.address,
            },
          });
          // Create new user if doesn't exist
          if (!user) {
            user = await prisma.user.create({
              data: {
                address: credentials?.address,
              },
            });
            // create account
            await prisma.account.create({
              data: {
                userId: user.id,
                type: "credentials",
                provider: "Ethereum",
                providerAccountId: credentials?.address,
              },
            });
          }

          return {
            id: credentials?.address,
          };
        } catch (e) {
          return null;
        }
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
