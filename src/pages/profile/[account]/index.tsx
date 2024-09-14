import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Herd from "~/components/Herd";
import Layout from "~/components/Layout";
import Link from "next/link";
import Image from "next/image";
import { truncateAccount } from "~/utils/addresses";
import { Spinner } from "flowbite-react";
import { getQueryString } from "~/utils/routes";
import { CollagePreview } from "~/components/CollagePreview";
import { type GridItemProps } from "~/components/CollageModal";
import { handleUserPFPDoesNotExist } from "~/utils/images";
import MetaTags from "~/components/MetaTags";
import { extractProfileFromUser } from "~/utils/wallet";

// const WalletMultiButtonDynamic = dynamic(
//   async () =>
//     (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
//   { ssr: false }
// );

export default function Profile() {
  const { data: session } = useSession();
  const router = useRouter();
  const { account } = router.query;

  const isWallet = account && account.length > 32;
  const queryString = getQueryString(account);
  const {
    data: user,
    isLoading,
    refetch,
  } = api.binding.getUser.useQuery({
    type: isWallet ? "wallet" : "discord",
    id: queryString,
  });
  const { userHandle, userPFP, favoriteDomain } = extractProfileFromUser(user);

  const wallets = user?.wallets ?? [];
  const userHerds = api.useQueries((t) =>
    wallets.map((wallet) => t.herd.getUserHerds(wallet.address))
  );
  const totalHerds = userHerds.reduce((total, wallet) => {
    return total + (wallet.data?.length || 0);
  }, 0);

  const authWallet = wallets.some(
    (item) => item.address === session?.user.name
  );

  const isOwner =
    session &&
    (session.user.name === user?.discord?.username ||
      session?.user.name === user?.twitter?.username ||
      session?.user.username === user?.telegram?.username ||
      authWallet);

  console.log(session);
  console.log(user);

  const { data: collages } = api.fusion.getPublicCollages.useQuery({
    userId: user?.id || "None",
    isOwner: isOwner ? isOwner : false,
  });

  const { data: walletHerds } = api.herd.getUserHerds.useQuery(queryString);

  useEffect(() => {
    setTimeout(async () => {
      refetch();
    }, 2000);
    refetch();
  }, [session, refetch]);

  const { data: userTribes } = api.subdao.getUserSubDAOs.useQuery({
    wallets: wallets.map((wallet) => wallet.address),
  });

  const updateVisibility = api.fusion.hideCollage.useMutation();

  const onHide = (id: string, hidden: boolean) => {
    updateVisibility.mutate({
      id: id,
      hidden: hidden,
    });
  };

  return (
    <>
      <MetaTags title="Clayno.club | Profile" />
      <Layout>
        <section className="flex w-full flex-col items-center justify-center gap-8 py-4 md:flex-row md:items-start md:px-4 md:py-8">
          <div className="flex flex-row flex-wrap justify-center rounded-xl bg-neutral-800 p-4 align-middle">
            {isLoading ? (
              <Spinner className="self-center" />
            ) : (
              <div className="flex flex-col self-center">
                {user ? (
                  <div className="grid grid-cols-2">
                    <div className="mr-2 flex flex-col justify-center">
                      <Image
                        className="self-center rounded-full"
                        src={
                          userPFP ??
                          `https://ui-avatars.com/api/?name=${user?.defaultAddress}&background=random`
                        }
                        alt="Avatar"
                        width={75}
                        height={75}
                        onError={handleUserPFPDoesNotExist}
                      />
                      <div className="self-center p-2 font-extrabold text-white">
                        {userHandle
                          ? userHandle
                          : favoriteDomain
                          ? `${favoriteDomain}.sol`
                          : truncateAccount(user.defaultAddress)}
                      </div>
                    </div>
                    <div className="flex flex-col justify-center p-2">
                      {user.discord && (
                        <div className="flex flex-row gap-2 p-2 align-middle">
                          <Image
                            src={"/icons/discord.svg"}
                            alt="Discord"
                            width={26}
                            height={26}
                          />
                          <div className="self-center text-sm">
                            {user.discord.username}
                          </div>
                        </div>
                      )}
                      {user.twitter && !user.twitter.private && (
                        <div>
                          <Link
                            className="flex flex-row gap-2 rounded-md p-2 align-middle text-white hover:bg-white/10"
                            href={`https://twitter.com/${user.twitter.username}`}
                            target="_blank"
                          >
                            <Image
                              src={"/icons/twitter.svg"}
                              alt="Twitter"
                              width={26}
                              height={26}
                            />
                            <div className="self-center text-sm">
                              @{user.twitter.username}
                            </div>
                          </Link>
                        </div>
                      )}
                      {user.telegram &&
                        !user.telegram.private &&
                        user.telegram.isActive && (
                          <div>
                            <Link
                              className="flex flex-row gap-2 rounded-md p-2 align-middle text-white hover:bg-white/10"
                              href={`https://t.me/${user.telegram.username}`}
                              target="_blank"
                            >
                              <Image
                                src={"/icons/telegram.svg"}
                                alt="Telegram"
                                width={26}
                                height={26}
                              />
                              <div className="self-center text-sm">
                                @{user.telegram.username}
                              </div>
                            </Link>
                          </div>
                        )}

                      <div>
                        <Link
                          className="flex flex-row gap-2 rounded-md p-2 align-middle text-white hover:bg-white/10"
                          href={`https://www.tensor.trade/portfolio?wallet=${user.defaultAddress}&portSlug=claynosaurz`}
                          target="_blank"
                        >
                          <Image
                            src="/icons/tensor.svg"
                            alt="Tensor Profile"
                            height={20}
                            width={20}
                          />
                          <div className="self-center text-sm">
                            {truncateAccount(user.defaultAddress)}
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2">
                    <div className="flex flex-col justify-center">
                      <Image
                        className="self-center rounded-full"
                        src={`https://ui-avatars.com/api/?name=${queryString}&background=random`}
                        alt="Avatar"
                        width={75}
                        height={75}
                      />
                      <div className="self-center p-2 font-extrabold text-white">
                        {truncateAccount(queryString)}
                      </div>
                    </div>
                    <div className="flex flex-col justify-center p-2">
                      <div>
                        <Link
                          className="flex flex-row gap-2 rounded-md p-2 align-middle text-white hover:bg-white/10"
                          href={`https://www.tensor.trade/portfolio?wallet=${queryString}&portSlug=claynosaurz`}
                          target="_blank"
                        >
                          <Image
                            src="/icons/tensor.svg"
                            alt="Tensor Profile"
                            height={20}
                            width={20}
                          />
                          <div className="self-center text-sm">
                            {truncateAccount(queryString)}
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
                {isOwner && user && (
                  <button
                    className="mt-2 w-full rounded-lg bg-orange-500 px-2 py-2 text-sm font-bold"
                    onClick={() => router.push(`${router.asPath}/settings`)}
                  >
                    Edit Profile
                  </button>
                )}
                <Link
                  href={`/inventory/${queryString}`}
                  className="mt-2 w-full rounded-lg bg-cyan-700 px-2 py-2 text-center text-sm font-bold"
                >
                  Inventory
                </Link>
              </div>
            )}
          </div>
          {userTribes && userTribes?.length > 0 && (
            <div className="flex flex-col items-center rounded-lg bg-neutral-800 px-4 py-2">
              <div className="p-2 text-lg font-extrabold">Tribes</div>
              <div className="grid grid-cols-2">
                {userTribes.map((tribe, index) => (
                  <Link
                    key={index}
                    href={`/tribes/${tribe.acronym}`}
                    className="cursor-pointer rounded-lg p-1 hover:bg-neutral-700"
                  >
                    <div className="flex flex-row items-center justify-start gap-x-3">
                      <div className="relative h-9 w-9 overflow-clip">
                        <Image
                          src={tribe.thumbnail ?? ""}
                          alt=""
                          fill
                          className="rounded-md"
                        />
                      </div>
                      <div className="text-xs font-bold">{tribe.name}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        {collages && collages.length > 0 && (
          <section className="flex w-full flex-col items-center gap-2">
            <div className="mt-8 p-2 text-xl font-extrabold">Custom Herds</div>
            <div className="flex w-full flex-col gap-8">
              {collages?.map((collage) => (
                <CollagePreview
                  key={collage.id}
                  id={collage.id}
                  rows={collage.rows}
                  cols={collage.columns}
                  borderColor={collage.borderColor}
                  borderWidth={collage.borderWidth}
                  grid={collage.data as GridItemProps[][]}
                  collage={collage}
                  asProfile={true}
                  onHide={onHide}
                  isOwner={isOwner ? isOwner : false}
                />
              ))}
            </div>
          </section>
        )}

        <section className="flex w-full flex-col items-center gap-2">
          {isWallet ? (
            <>
              {
                walletHerds && walletHerds.length > 0 && (
                  <>
                    <div className="mt-8 p-2 text-xl font-extrabold">
                      Detected Herds
                    </div>
                    <div className="flex w-full flex-col md:w-1/2 lg:w-2/5">
                      {walletHerds.map((herd) => (
                        <Herd
                          key={herd.id}
                          herd={herd}
                          showDactyl={true}
                          showSaga={true}
                          showOwner={false}
                          showPFP={false}
                        />
                      ))}
                    </div>
                  </>
                )
                // <div className="relative flex aspect-square w-72 justify-center self-center">
                //   <Image
                //     src="/gifs/raptorSus_01.gif"
                //     alt="Sus"
                //     fill
                //     className="self-center rounded-lg"
                //   />
                //   <div className="absolute left-0 top-0 m-2 rounded-lg bg-black p-2 text-lg font-extrabold">
                //     No herds!?
                //   </div>
                // </div>
              }
            </>
          ) : (
            <>
              {userHerds &&
                userHerds.map((wallet, index) => (
                  <div
                    key={index}
                    className="flex w-full flex-col md:w-1/2 lg:w-2/5"
                  >
                    {wallet.data?.map((herd) => (
                      <Herd
                        key={herd.id}
                        herd={herd}
                        showDactyl={true}
                        showSaga={true}
                        showOwner={false}
                        showPFP={false}
                      />
                    ))}
                  </div>
                ))}
              {totalHerds === 0 && (
                <div className="relative flex aspect-square w-72 justify-center self-center">
                  <Image
                    src="/gifs/raptorSus_01.gif"
                    alt="Sus"
                    fill
                    className="self-center rounded-lg"
                  />
                  <div className="absolute left-0 top-0 m-2 rounded-lg bg-black p-2 text-lg font-extrabold">
                    No herds!?
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </Layout>
    </>
  );
}
