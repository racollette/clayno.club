import { useWallet } from "@solana/wallet-adapter-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { type Key, useEffect, useState } from "react";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import Image from "next/image";
import { Spinner } from "flowbite-react";
import { getSessionDetails } from "~/utils/session";
import AddWalletModal from "../../../components/profile/AddWalletModal";
import { truncateAccount } from "~/utils/addresses";
import useLocalStorage from "~/utils/storage";
import AlertModal from "~/components/AlertModal";
import { useRouter } from "next/router";
import MetaTags from "~/components/MetaTags";
import { useToast } from "~/@/components/ui/use-toast";
import { handleUserPFPDoesNotExist } from "~/utils/images";
import { LoginButton } from "@telegram-auth/react";
import ToggleSwitch from "~/components/ToggleSwitch";

const Settings = () => {
  const { toast } = useToast();
  const { data: session } = useSession();
  const { publicKey, connected } = useWallet();
  const router = useRouter();
  const { account } = router.query;
  // const { user, sessionType, isLoading, refetch } = getUserSession();
  const { sessionType, id } = getSessionDetails(session);
  const [userId, setUserId] = useState<string | undefined>();
  const [unlinkedDiscord, setUnlinkedDiscord] = useState<boolean>(false);
  const [unlinkedTwitter, setUnlinkedTwitter] = useState<boolean>(false);
  const [unlinkedTelegram, setUnlinkedTelegram] = useState<boolean>(false);
  const [storedUserId, setStoredUserId] = useLocalStorage("userId", "");
  const [showTelegramWidget, setShowTelegramWidget] = useState<boolean>(false);

  const linkDiscord = api.binding.linkDiscord.useMutation();
  const linkTwitter = api.binding.linkTwitter.useMutation();
  const linkTelegram = api.binding.linkTelegram.useMutation();
  const unlinkDiscord = api.binding.unlinkDiscord.useMutation();
  const unlinkTwitter = api.binding.unlinkTwitter.useMutation();
  const unlinkTelegram = api.binding.unlinkTelegram.useMutation();
  const setDefaultWallet = api.binding.setDefaultWallet.useMutation();
  const deleteWallet = api.binding.deleteWallet.useMutation();
  const linkWallet = api.binding.linkWallet.useMutation();
  const deleteAccount = api.binding.deleteUser.useMutation();
  const createVoter = api.vote.createVoter.useMutation();
  const issueVotes = api.vote.issueVotes.useMutation();
  const updatePrivacyStatus = api.binding.updatePrivacyStatus.useMutation();

  const {
    data: user,
    refetch,
    isLoading,
  } = api.binding.getUser.useQuery({
    type: userId ? "id" : connected ? "wallet" : sessionType ?? "none",
    id: userId
      ? userId
      : connected && publicKey
      ? publicKey.toString()
      : id ?? "none",
  });

  const { data: voterInfo } = api.vote.getVoterInfo.useQuery({
    userId: user?.id ?? "none",
  });

  const { data: holderData } = api.general.getHolderDinos.useQuery({
    wallets: user?.wallets.map((wallet) => wallet.address) ?? ["none"],
  });

  const holderDinos =
    (holderData && holderData.flatMap((holder) => holder && holder?.mints)) ||
    [];
  const voteEligible = holderDinos?.length > 0;

  useEffect(() => {
    if (user?.id) {
      setUserId(user?.id);
    }
  }, [user?.id]);

  useEffect(() => {
    refetch();
  }, [linkTwitter, linkDiscord, linkWallet, linkTelegram, refetch]);

  useEffect(() => {
    linkSocial();
  }, [isLoading]);

  const linkSocial = async () => {
    try {
      const profile = session?.user?.profile;
      if (profile?.image_url) {
        if (userId || storedUserId) {
          if (user?.discord) return;
          linkDiscord.mutate({
            id: userId || storedUserId,
            data: {
              username: profile.username,
              global_name: profile.global_name,
              image_url: profile.image_url,
              id: profile.profile_id,
            },
          });
          setUnlinkedDiscord(false);
        }
      } else if (profile?.data) {
        if (userId || storedUserId) {
          if (user?.twitter) return;
          linkTwitter.mutate({
            id: userId || storedUserId,
            data: {
              username: profile.data.username,
              global_name: profile.data.name,
              image_url: profile.data.profile_image_url,
            },
          });
          setUnlinkedTwitter(false);
        }
      } else if (session?.user.type === "telegram") {
        // console.log("Attempting to link Telegram account");
        // console.log(`User: ${user}`);
        // console.log(`Session: ${session}`);
        // console.log("data", {
        const entry = {
          username: session.user.username ?? session.user.global_name,
          global_name: session.user.global_name,
          image_url:
            session.user.image_url ??
            `https://ui-avatars.com/api/?name=${session.user.global_name}&background=random`,
          telegramId: session.user.id,
        };

        if (user?.telegram) return;
        linkTelegram.mutate({
          id: userId || storedUserId,
          data: entry,
        });
      }
    } catch (error) {
      console.error("Error writing data:", error);
    }
  };

  const handleUnlink = (provider: string) => {
    if (user?.discord && provider === "discord") {
      try {
        unlinkDiscord.mutate(user?.id);
        setUnlinkedDiscord(true);
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
    if (user?.twitter && provider === "twitter") {
      try {
        unlinkTwitter.mutate(user?.id);
        setUnlinkedTwitter(true);
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
    if (user?.telegram && provider === "telegram") {
      try {
        unlinkTelegram.mutate(user?.id);
        setUnlinkedTelegram(true);
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  const onDelete = async () => {
    try {
      if (user) {
        deleteAccount.mutate({ id: user?.id });
        router.push("/");
        await signOut({ redirect: false });
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleCreateVoter = async () => {
    try {
      if (user) {
        if (voterInfo?.votesIssued === false) {
          issueVotes.mutate({
            userId: user.id,
            wallets: user.wallets.map((wallet) => wallet.address),
          });
          toast({
            title: "Votes issued",
          });
        } else {
          createVoter.mutate({
            userId: user.id,
            wallets: user.wallets.map((wallet) => wallet.address),
          });
          toast({
            title: "Voter account created",
          });
        }
      }
    } catch (error) {
      console.error("Error creating voter account:", error);
    }
  };

  const [privacyStatus, setPrivacyStatus] = useState({
    telegram: false,
    twitter: false,
  });

  const handleTogglePrivacyStatus = (type: string, setPrivate: boolean) => {
    if (userId) {
      updatePrivacyStatus.mutate({ type, private: setPrivate, userId });
      setPrivacyStatus({ ...privacyStatus, [type]: setPrivate });
    }
  };

  useEffect(() => {
    setPrivacyStatus({
      twitter: user?.twitter?.private ?? false,
      telegram: user?.telegram?.private ?? false,
    });
  }, [user]);

  return (
    <>
      <MetaTags title="Clayno.club | Resources" />
      <Layout>
        <div className="lg:w-1/2">
          <div>
            <div className="text-xl font-extrabold">Social Accounts</div>
            <div className="py-2 text-sm text-zinc-500">
              Verify your identity so we can display your name next to your
              dinos!
            </div>
            <div className="flex flex-col gap-6 rounded-lg bg-neutral-800 p-4">
              {user?.discord && !unlinkedDiscord ? (
                <div className="flex flex-row justify-between gap-4 md:gap-12">
                  <div className="flex flex-row items-center justify-center">
                    <div className="relative mr-4 h-10 w-10 overflow-clip rounded-lg">
                      <Image
                        src={user?.discord.image_url}
                        fill
                        alt="Avatar"
                        onError={handleUserPFPDoesNotExist}
                      />
                    </div>
                    <span className="md:text-mdself-center text-sm">
                      {user?.discord.global_name}
                    </span>
                  </div>
                  <button
                    className="self-end rounded-lg bg-neutral-900 px-3 py-2 md:px-4 md:py-3"
                    onClick={() => handleUnlink("discord")}
                  >
                    <div className="flex flex-row items-center justify-center gap-2">
                      <Image
                        src="/icons/discord.svg"
                        alt="Discord"
                        width={24}
                        height={24}
                      />
                      <div className="md:text-md flex flex-row whitespace-nowrap text-sm">
                        <span>Unlink</span>{" "}
                        <span className="hidden md:block">&nbsp;Discord</span>
                      </div>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="flex align-middle">
                  {linkDiscord.isLoading ? (
                    <Spinner className="self-center" />
                  ) : (
                    <button
                      className="mr-4 rounded-lg bg-neutral-900 px-3 py-2 md:px-4 md:py-3"
                      disabled={linkDiscord.isLoading}
                      onClick={() => {
                        setStoredUserId(userId);
                        signIn("discord");
                      }}
                    >
                      <div className="flex flex-row items-center justify-center gap-4">
                        <Image
                          src="/icons/discord.svg"
                          alt="Discord"
                          width={24}
                          height={24}
                        />
                        <div className="md:text-md whitespace-nowrap text-sm">
                          Connect Discord
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              )}
              {user?.twitter && !unlinkedTwitter ? (
                <div className="flex flex-row justify-between gap-12">
                  <div className="flex flex-row items-center justify-center">
                    <div className="relative mr-4 h-10 w-10 overflow-clip rounded-lg">
                      <Image
                        src={user?.twitter.image_url}
                        fill
                        alt="Avatar"
                        onError={handleUserPFPDoesNotExist}
                      />
                    </div>
                    <span className="md:text-md self-center text-sm">
                      {user?.twitter.global_name}
                    </span>
                  </div>
                  <button
                    className="self-end rounded-lg bg-neutral-900 px-3 py-2 md:px-4 md:py-3"
                    onClick={() => handleUnlink("twitter")}
                  >
                    <div className="flex flex-row items-center justify-center gap-2">
                      <Image
                        src="/icons/twitter.svg"
                        alt="Twitter"
                        width={24}
                        height={24}
                      />
                      <div className="md:text-md flex flex-row whitespace-nowrap text-sm">
                        <span>Unlink</span>
                        <span className="hidden md:block">&nbsp;Twitter</span>
                      </div>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="flex align-middle">
                  {linkTwitter.isLoading ? (
                    <Spinner className="self-center" />
                  ) : (
                    <button
                      className="mr-4 rounded-lg bg-neutral-900 px-3 py-2 md:px-4 md:py-3"
                      disabled={linkTwitter.isLoading}
                      onClick={() => {
                        setStoredUserId(userId);
                        signIn("twitter");
                      }}
                    >
                      <div className="flex flex-row items-center justify-center gap-4">
                        <Image
                          src="/icons/twitter.svg"
                          alt="Twitter"
                          width={24}
                          height={24}
                        />
                        <div className="md:text-md whitespace-nowrap text-sm">
                          Connect Twitter
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              )}
              {user?.telegram &&
              user?.telegram.isActive &&
              !unlinkedTelegram ? (
                <div className="flex flex-row justify-between gap-12">
                  <div className="flex flex-row items-center justify-center">
                    <div className="relative mr-4 h-10 w-10 overflow-clip rounded-lg">
                      <Image
                        src={user?.telegram.image_url}
                        fill
                        alt="Avatar"
                        onError={handleUserPFPDoesNotExist}
                      />
                    </div>
                    <span className="md:text-md self-center text-sm">
                      {user?.telegram.global_name}
                    </span>
                  </div>
                  <button
                    className="self-end rounded-lg bg-neutral-900 px-3 py-2 md:px-4 md:py-3"
                    onClick={() => handleUnlink("telegram")}
                  >
                    <div className="flex flex-row items-center justify-center gap-2">
                      <Image
                        src="/icons/telegram.svg"
                        alt="Telegram"
                        width={24}
                        height={24}
                      />
                      <div className="md:text-md flex flex-row whitespace-nowrap text-sm">
                        <span>Unlink</span>
                        <span className="hidden md:block">&nbsp;Telegram</span>
                      </div>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="flex align-middle">
                  {linkTelegram.isLoading ? (
                    <Spinner className="self-center" />
                  ) : (
                    <>
                      {!showTelegramWidget ? (
                        <button
                          className="mr-4 rounded-lg bg-neutral-900 px-3 py-2 md:px-4 md:py-3"
                          disabled={linkTelegram.isLoading}
                          onClick={() => {
                            setStoredUserId(userId);
                            setShowTelegramWidget(true);
                            // signIn("telegram");
                          }}
                        >
                          <div className="flex flex-row items-center justify-center gap-4">
                            <Image
                              src="/icons/telegram.svg"
                              alt="Telegram"
                              width={24}
                              height={24}
                            />
                            <div className="md:text-md whitespace-nowrap text-sm">
                              Connect Telegram
                            </div>
                          </div>
                        </button>
                      ) : (
                        <LoginButton
                          showAvatar={false}
                          botUsername={"ClaynoClubBot"}
                          onAuthCallback={(data) => {
                            signIn(
                              "telegram",
                              {
                                callbackUrl: `/profile/${account}/settings`,
                              },
                              data as any
                            );
                          }}
                        />
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="mt-8">
            <div className="text-xl font-extrabold">Wallets</div>
            <div className="py-2 text-sm text-zinc-500">
              You can connect multiple wallets. All of these wallets will be
              able to access your profile.
            </div>
            <div className="flex flex-col gap-6 rounded-lg bg-neutral-800 p-4">
              {user?.defaultAddress && (
                <div className="flex flex-row justify-between">
                  <div className="self-center">
                    {truncateAccount(user.defaultAddress)}
                    <span className="ml-2 rounded-md bg-emerald-500 px-2 py-1 text-xs text-black">
                      Default
                    </span>
                  </div>
                  {/* <button
                className="rounded-md bg-red-500 px-2 py-1 text-sm"
                onClick={() => {
                  deleteWallet.mutate({
                    id: user.id,
                    wallet: user.defaultAddress,
                  });
                }}
              >
                Remove Wallet
        
              </button> */}
                  <AlertModal
                    button="Delete Account"
                    title="Are you absolutely sure?"
                    message="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
                    accept="Yes, delete account"
                    onDelete={onDelete}
                  />
                </div>
              )}
              {user?.wallets.map(
                (
                  wallet: { address: string },
                  index: Key | null | undefined
                ) => {
                  if (wallet.address !== user.defaultAddress) {
                    return (
                      <div
                        key={index}
                        className="flex flex-row justify-between"
                      >
                        <div className="self-center">
                          {truncateAccount(wallet.address)}
                          <span
                            className="ml-2 cursor-pointer  text-xs text-zinc-500"
                            onClick={() => {
                              setDefaultWallet.mutate({
                                id: user.id,
                                wallet: wallet.address,
                              });
                            }}
                          >
                            Set Default
                          </span>
                        </div>
                        <button
                          className="rounded-md bg-amber-600 px-2 py-1 text-sm font-extrabold hover:bg-amber-700"
                          onClick={() => {
                            deleteWallet.mutate({
                              id: user.id,
                              wallet: wallet.address,
                            });
                          }}
                        >
                          Remove Wallet
                        </button>
                      </div>
                    );
                  }
                }
              )}
              {userId && (
                <AddWalletModal linkWallet={linkWallet} userId={userId} />
              )}
            </div>
          </div>

          {(user?.twitter || user?.telegram) && (
            <div className="mt-8">
              <div className="text-xl font-extrabold">Privacy</div>
              <div className="py-2 text-sm text-zinc-500">
                Choose which social accounts can be viewed by others.
              </div>
              <div className="flex flex-row gap-6 rounded-lg bg-neutral-800 p-4">
                {user?.twitter && (
                  <ToggleSwitch
                    className="self-end"
                    toggleState={!privacyStatus.twitter}
                    label={"Twitter"}
                    onToggle={() =>
                      handleTogglePrivacyStatus(
                        "twitter",
                        !privacyStatus.twitter
                      )
                    }
                  />
                )}
                {user?.telegram && (
                  <ToggleSwitch
                    className="self-end"
                    toggleState={!privacyStatus.telegram}
                    label={"Telegram"}
                    onToggle={() =>
                      handleTogglePrivacyStatus(
                        "telegram",
                        !privacyStatus.telegram
                      )
                    }
                  />
                )}
              </div>
            </div>
          )}

          <div className="mt-8">
            <div className="text-xl font-extrabold">Voting</div>
            <div className="py-2 text-sm text-zinc-500">
              You can request votes here if they are not automatically added to
              your account.
            </div>
            <div className="flex flex-col gap-6 rounded-lg bg-neutral-800 p-4">
              <button
                className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-neutral-700"
                disabled={!voteEligible || voterInfo?.votesIssued}
                onClick={handleCreateVoter}
              >
                Request Votes
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Settings;
