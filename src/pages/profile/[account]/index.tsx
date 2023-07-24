import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
// import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSessionDetails } from "~/utils/session";
import Herd from "~/components/Herd";
import Layout from "~/components/Layout";

// const WalletMultiButtonDynamic = dynamic(
//   async () =>
//     (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
//   { ssr: false }
// );

export default function Profile() {
  const { data: session } = useSession();
  const router = useRouter();
  const { account } = router.query;
  const { sessionType, id } = getSessionDetails(session);

  const queryString = account
    ? Array.isArray(account)
      ? account.join(",")
      : account
    : "";
  const isWallet = account && account.length > 32;

  const {
    data: user,
    isLoading,
    refetch,
  } = api.binding.getUser.useQuery({
    type: isWallet ? "wallet" : "discord",
    id: queryString,
  });

  const wallets = user?.wallets ?? [];
  const userHerds = api.useQueries((t) =>
    wallets.map((wallet) => t.herd.getUserHerds(wallet.address))
  );

  const walletHerds = api.herd.getUserHerds.useQuery(queryString);

  useEffect(() => {
    setTimeout(async () => {
      refetch();
    }, 2000);
    refetch();
  }, [session]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-4 md:px-4 md:py-8 ">
        <div className="flex flex-row flex-wrap align-middle">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div>
              <button
                className="rounded-lg bg-orange-500 px-4 py-2"
                onClick={() => router.push(`${router.asPath}/settings`)}
              >
                Edit Profile
              </button>
              <div className="relative p-4">{user?.defaultAddress}</div>
              {/* <div className="relative p-4">{data.discord}</div>
                <div className="relative p-4">{data.twitter}</div> */}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        {isWallet ? (
          <div>
            {walletHerds &&
              walletHerds.data?.map((herd) => (
                <Herd herd={herd} showDactyl={true} showSaga={true} />
              ))}
          </div>
        ) : (
          <>
            {userHerds &&
              userHerds.map((wallet) => (
                <div>
                  {wallet.data?.map((herd) => (
                    <Herd herd={herd} showDactyl={true} showSaga={true} />
                  ))}
                </div>
              ))}
          </>
        )}
      </div>
    </Layout>
  );
}
