import { z } from "zod";
import { prisma } from "../../db";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { createUploadthing } from "uploadthing/next-legacy";

const createUserRequestSchema = z.object({
  address: z.string(),
});

const linkSocialProfileRequestSchema = z.object({
  id: z.string(),
  data: z.object({
    username: z.string(),
    global_name: z.string(),
    image_url: z.string(),
    id: z.string().optional(),
  }),
});

const f = createUploadthing();

export const bindingRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(createUserRequestSchema)
    .mutation(async ({ input }) => {
      // Create a new user in the database
      try {
        const createdUser = await prisma.user.create({
          data: {
            defaultAddress: input.address,
            wallets: {
              create: { address: input.address },
            },
          },
        });

        await prisma.account.create({
          data: {
            userId: createdUser.id,
            type: "credentials",
            provider: "Ethereum",
            providerAccountId: input.address,
          },
        });

        return createdUser;
      } catch (error) {
        throw new Error("Failed to set up account");
      }
    }),

  getUser: publicProcedure
    .input(z.object({ type: z.string(), id: z.string() }))
    .query(async ({ input }) => {
      if (input.type === "id") {
        const user = await prisma.user.findFirst({
          where: {
            id: input.id,
          },
          include: {
            discord: true,
            twitter: true,
            telegram: true,
            wallets: true,
          },
        });
        return user;
      }

      if (
        input.type === "discord" ||
        input.type === "twitter" ||
        input.type === "telegram"
      ) {
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              {
                discord: {
                  username: {
                    contains: input.id,
                  },
                },
              },
              {
                discord: {
                  global_name: {
                    contains: input.id,
                  },
                },
              },
              {
                twitter: {
                  username: {
                    contains: input.id,
                  },
                },
              },
              {
                twitter: {
                  global_name: {
                    contains: input.id,
                  },
                },
              },
              {
                telegram: {
                  username: {
                    contains: input.id,
                  },
                },
              },
              {
                telegram: {
                  global_name: {
                    contains: input.id,
                  },
                },
              },
            ],
          },
          include: {
            discord: true,
            twitter: true,
            telegram: true,
            wallets: true,
          },
        });

        if (user?.twitter?.private === true) {
          user.twitter.username = "hidden";
        }

        if (user?.telegram?.private === true) {
          user.telegram.username = "hidden";
          user.telegram.telegramId = "hidden";
        }

        return user;
      }

      // if (input.type === "twitter") {
      //   const user = await prisma.user.findFirst({
      //     where: {
      //       twitter: {
      //         global_name: input.id,
      //       },
      //     },
      //     include: {
      //       discord: true,
      //       twitter: true,
      //     },
      //   });
      //   return user;
      // }

      const user = await prisma.user.findFirst({
        where: {
          wallets: {
            some: {
              address: {
                contains: input.id,
              },
            },
          },
        },
        include: {
          discord: true,
          twitter: true,
          telegram: true,
          wallets: true,
        },
      });

      if (user?.twitter?.private === true) {
        user.twitter.username = "hidden";
      }

      if (user?.telegram?.private === true) {
        user.telegram.username = "hidden";
        user.telegram.telegramId = "hidden";
      }

      return user;
    }),

  linkDiscord: protectedProcedure
    .input(linkSocialProfileRequestSchema)
    .mutation(async ({ input }) => {
      const providerExists = await prisma.discord.findUnique({
        where: {
          username: input.id,
        },
      });

      if (!providerExists) {
        // const linkedSocial = await prisma.discord.create({
        //   data: input,
        // });

        const linkedSocial = await prisma.user.update({
          where: {
            id: input.id,
          },
          data: {
            discord: {
              create: input.data,
            },
          },
        });
        return linkedSocial;
      }
    }),

  unlinkDiscord: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const deleteProvider = await prisma.discord.delete({
        where: {
          userId: input,
        },
      });

      // const deleteProvider = await prisma.user.update({
      //   where: {
      //     address: input,
      //   },
      //   data: {
      //     discord: {
      //       delete: true,
      //     },
      //   },
      // });

      return deleteProvider;
    }),

  // getUserDiscord: protectedProcedure
  //   .input(z.string())
  //   .query(async ({ input }) => {
  //     const provider = await prisma.discord.findUnique({
  //       where: {
  //         address: input,
  //       },
  //     });

  //     return provider;
  //   }),

  linkTwitter: protectedProcedure
    .input(linkSocialProfileRequestSchema)
    .mutation(async ({ input }) => {
      try {
        const providerExists = await prisma.twitter.findUnique({
          where: {
            username: input.id,
          },
        });

        if (!providerExists) {
          const linkedSocial = await prisma.user.update({
            where: {
              id: input.id,
            },
            data: {
              twitter: {
                create: input.data,
              },
            },
          });
          return linkedSocial;
        }
      } catch (error) {
        console.error("Error linking twitter:", error);
        throw new Error("Failed to link Twitter account");
      }
    }),

  unlinkTwitter: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const deleteProvider = await prisma.twitter.delete({
        where: {
          userId: input,
        },
      });

      return deleteProvider;
    }),

  linkTelegram: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          username: z.string().optional(),
          global_name: z.string(),
          image_url: z.string(),
          telegramId: z.string(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const providerExists = await prisma.telegram.findUnique({
          where: {
            telegramId: input.data.telegramId,
          },
        });

        if (!providerExists) {
          const linkedSocial = await prisma.user.update({
            where: {
              id: input.id,
            },
            data: {
              telegram: {
                create: input.data,
              },
            },
          });
          return linkedSocial;
        }

        if (!providerExists?.isActive) {
          const reactivateLinkedSocial = await prisma.telegram.update({
            where: {
              telegramId: input.data.telegramId,
            },
            data: {
              isActive: true,
            },
          });
          return reactivateLinkedSocial;
        }
      } catch (error) {
        console.error("Error linking telegram:", error);
        throw new Error("Failed to link Telegram account");
      }
    }),

  unlinkTelegram: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      // const deleteProvider = await prisma.telegram.delete({
      //   where: {
      //     userId: input,
      //   },
      // });

      // return deleteProvider;

      const inactivateProvider = await prisma.telegram.update({
        where: {
          userId: input,
        },
        data: {
          isActive: false,
        },
      });

      return inactivateProvider;
    }),

  // getUserTwitter: protectedProcedure
  //   .input(z.string())
  //   .query(async ({ input }) => {
  //     const provider = await prisma.twitter.findUnique({
  //       where: {
  //         address: input,
  //       },
  //     });

  //     return provider;
  //   }),

  linkWallet: protectedProcedure
    .input(z.object({ id: z.string(), wallet: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const linkedWallet = await prisma.user.update({
          where: {
            id: input.id,
          },
          data: {
            wallets: {
              create: { address: input.wallet },
            },
          },
          include: {
            wallets: true,
            discord: true,
            twitter: true,
          },
        });

        const checkHolderStatus = await prisma.holder.findFirst({
          where: {
            owner: input.wallet,
          },
        });
        const dinosOwned = checkHolderStatus?.amount || 0;

        // const voterInfo = await prisma.voter.findUnique({
        //   where: {
        //     userId: ctx.session.user.id,
        //   },
        // });

        // if (!voterInfo) {
        //   await prisma.voter.create({
        //     data: {
        //       userId: ctx.session.user.id,
        //       votesAvailable: dinosOwned > 0 ? 20 : 0,
        //       votesCast: 0,
        //       votesIssued: dinosOwned > 0 ? true : false,
        //     },
        //   });
        // } else {
        //   await prisma.voter.update({
        //     where: {
        //       userId: ctx.session.user.id,
        //     },
        //     data: {
        //       votesAvailable: voterInfo?.votesIssued
        //         ? voterInfo.votesAvailable
        //         : dinosOwned > 0
        //         ? 20
        //         : 0,
        //       votesIssued: dinosOwned > 0 ? true : false,
        //     },
        //   });
        // }

        return linkedWallet;
      } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error("Failed to link wallet");
      }
    }),

  setDefaultWallet: protectedProcedure
    .input(z.object({ id: z.string(), wallet: z.string() }))
    .mutation(async ({ input }) => {
      const defaultWallet = await prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          defaultAddress: input.wallet,
        },
      });
      return defaultWallet;
    }),

  deleteWallet: protectedProcedure
    .input(z.object({ id: z.string(), wallet: z.string() }))
    .mutation(async ({ input }) => {
      const deletedWallet = await prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          wallets: {
            delete: [{ address: input.wallet }],
          },
        },
      });
      return deletedWallet;
    }),

  deleteUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        // const voterExists = await prisma.voter.findUnique({
        //   where: {
        //     userId: ctx.session.user.id,
        //   },
        // });

        // if (voterExists) {
        //   await prisma.voter.delete({
        //     where: {
        //       userId: ctx.session.user.id,
        //     },
        //   });
        // }
        const deleteUser = await prisma.user.delete({
          where: {
            id: input.id,
          },
        });

        return deleteUser;
      } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error("Failed to delete user.");
      }
    }),

  getUsersByWalletAddresses: publicProcedure
    .input(z.object({ walletAddresses: z.array(z.string()) || z.undefined() }))
    .query(async ({ input }) => {
      if (input.walletAddresses === undefined) return;

      return prisma.user.findMany({
        where: {
          wallets: {
            some: {
              address: {
                in: input.walletAddresses,
              },
            },
          },
        },
        include: {
          wallets: true,
          discord: true,
          twitter: true,
          telegram: true,
        },
      });
    }),

  getAllUsers: publicProcedure.query(async ({}) => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        defaultAddress: true,
        wallets: true,
        discord: true,
        twitter: true,
        telegram: true,
        image: true,
      },
    });

    const usersFiltered = users.map((user) => {
      if (user.twitter && user.twitter.private === true) {
        user.twitter.username = "hidden";
      }
      if (user.telegram && user.telegram.private === true) {
        user.telegram.username = "hidden";
        user.telegram.telegramId = "hidden";
      }
      return user;
    });

    return usersFiltered;
  }),

  updatePrivacyStatus: protectedProcedure
    .input(
      z.object({ type: z.string(), private: z.boolean(), userId: z.string() })
    )
    .mutation(async ({ input }) => {
      try {
        const updatePrivacyStatus = await prisma.user.update({
          where: {
            id: input.userId,
          },
          data: {
            [input.type]: {
              update: {
                private: input.private,
              },
            },
          },
        });

        return updatePrivacyStatus;
      } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error("Failed to delete user.");
      }
    }),

  linkAptosWallet: protectedProcedure
    .input(z.object({ id: z.string(), address: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const existingUser = await prisma.user.findFirst({
          where: { aptosWallet: input.address },
        });

        if (existingUser) {
          throw new Error("This Aptos wallet is already linked to an account.");
        }

        const updatedUser = await prisma.user.update({
          where: { id: input.id },
          data: { aptosWallet: input.address },
        });

        return updatedUser;
      } catch (error) {
        console.error("Error linking Aptos wallet:", error);
        throw new Error("Failed to link Aptos wallet");
      }
    }),

  unlinkAptosWallet: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const updatedUser = await prisma.user.update({
          where: { id: input.id },
          data: { aptosWallet: null },
        });
        return updatedUser;
      } catch (error) {
        console.error("Error unlinking Aptos wallet:", error);
        throw new Error("Failed to unlink Aptos wallet");
      }
    }),

  getAptosWallet: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: input.id },
          select: { aptosWallet: true },
        });
        return user?.aptosWallet;
      } catch (error) {
        console.error("Error fetching Aptos wallet:", error);
        throw new Error("Failed to fetch Aptos wallet");
      }
    }),

  updateUserAvatar: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        imageUrl: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.user.update({
        where: { id: input.userId },
        data: { image: input.imageUrl },
      });
    }),
});
