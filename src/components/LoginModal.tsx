import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import {
  Button,
  type CustomFlowbiteTheme,
  Modal,
  Spinner,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import bs58 from "bs58";
import { getCsrfToken, signIn, useSession, signOut } from "next-auth/react";
import { SigninMessage } from "~/utils/SigninMessage";
import { buildAuthTx, validateAuthTx } from "~/utils/authTx";
import { connection } from "~/server/rpc";
import { api } from "~/utils/api";
import ProfileButton from "./ProfileButton";
import { shortAccount, truncateAccount } from "~/utils/addresses";
import { getSessionDetails } from "~/utils/session";
import DefaultToast from "./Toast";

const customTheme: CustomFlowbiteTheme["modal"] = {
  content: {
    inner: "bg-zinc-900 rounded-lg",
    base: "relative w-full p-4 h-auto",
  },
};

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function LoginModal() {
  const router = useRouter();
  const { publicKey, signMessage, disconnect, connected, signTransaction } =
    useWallet();
  const [host, setHost] = useState<string>();
  const [openModal, setOpenModal] = useState<string | undefined>();
  // const [signing, setSigning] = useState<boolean>(false);
  const [useLedger, setUseLedger] = useState<boolean>(false);
  const walletModal = useWalletModal();

  const { data: session, status } = useSession();
  const [userId, setUserId] = useState<string | undefined>();
  const { sessionType, id } = getSessionDetails(session);

  // const loading = status === "loading";
  const signedIn = status === "authenticated";

  const { data: user, isLoading } = api.binding.getUser.useQuery({
    type: connected ? "wallet" : userId ? "id" : sessionType,
    id:
      connected && publicKey
        ? publicKey.toString()
        : userId
        ? userId
        : id ?? "",
  });

  // console.log(session);
  // console.log(signedIn);

  useEffect(() => {
    // setSigning(false);
    setUseLedger(false);
    setHost(window.location.host);
  }, []);

  useEffect(() => {
    if (user?.id) {
      setUserId(user.id);
    }
  }, [user]);

  const handleSignIn = async (useLedger: boolean) => {
    try {
      if (!connected) {
        walletModal.setVisible(true);
      }

      const csrf = await getCsrfToken();
      if (!publicKey || !csrf || !signMessage || !signTransaction) return;

      // setSigning(true);

      let validSignature;

      if (useLedger) {
        // Create tx
        const tx = buildAuthTx("test-nonce");
        tx.feePayer = publicKey; // not sure if needed but set this properly
        tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        // Encode and send tx to signer, decode and sign
        const signedTx = await signTransaction(tx);
        // Encode, send back, decode and verify signedTx signature
        validSignature = validateAuthTx(signedTx, "test-nonce");
        const inx = signedTx.instructions[2];
        const programId = inx?.programId.toString();
        const nonce = inx?.data.toString() || "";
        const verifySignatures = !tx.verifySignatures();

        signIn("sendMemo", {
          programId: programId,
          verifySignatures: verifySignatures,
          nonce: nonce,
          valid: validSignature,
          address: publicKey.toString(),
          redirect: false,
        });
      } else {
        const message = new SigninMessage({
          domain: host || "",
          publicKey: publicKey?.toBase58(),
          statement: `Rawr!\n \n Sign this message to log in to the app.\n`,
          nonce: csrf,
        });
        const data = new TextEncoder().encode(message.prepare());
        const signature = await signMessage(data);
        const serializedSignature = bs58.encode(signature);

        signIn("signMessage", {
          message: JSON.stringify(message),
          signature: serializedSignature,
          redirect: false,
        });
      }

      // setSigning(false);
      router.push(
        `/profile/${
          user?.discord?.username ??
          user?.twitter?.username ??
          user?.defaultAddress ??
          session?.user.name ??
          publicKey.toString()
        }`
      );

      setOpenModal(undefined);
    } catch (error) {
      console.log(error);
      // setSigning(false);
    }
  };

  const handleSignOut = async () => {
    router.push("/");
    await signOut({ redirect: false });
    walletModal.setVisible(false);
  };

  const handleDisconnect = () => {
    disconnect();
  };

  // useEffect(() => {
  //   if (connected && status === "unauthenticated") {
  //     handleSignIn();
  //   }
  // }, [connected]);

  return (
    <>
      {!signedIn ? (
        <Button
          size="sm"
          onClick={() => {
            handleDisconnect();
            setOpenModal("dismissible");
          }}
        >
          {isLoading ? (
            <div className="flex flex-row gap-2 align-middle">
              <Spinner size="sm" />
              <div>Signing In</div>
            </div>
          ) : (
            <div>Sign In</div>
          )}
        </Button>
      ) : (
        <>
          {!isLoading && user ? (
            <ProfileButton
              imageURL={
                user?.discord?.image_url ??
                user?.twitter?.image_url ??
                `https://ui-avatars.com/api/?name=${
                  user?.defaultAddress ??
                  session?.user.name ??
                  publicKey?.toString()
                }&background=random`
              }
              username={
                user?.discord?.global_name ??
                user?.twitter?.global_name ??
                shortAccount(user?.defaultAddress) ??
                session?.user.name ??
                publicKey?.toString()
              }
              handleSignout={handleSignOut}
              sessionKey={
                user?.discord?.username ??
                user?.twitter?.username ??
                user?.defaultAddress ??
                session?.user.name ??
                publicKey?.toString()
              }
            />
          ) : (
            <div className="flex flex-row gap-6">
              {!isLoading && (
                <DefaultToast
                  message={"Account not found. Please create one first."}
                  type={"error"}
                />
              )}
              {/* <Button onClick={handleSignOut}>Sign Out</Button> */}
              <Button
                onClick={() => {
                  handleDisconnect();
                  setOpenModal("dismissible");
                }}
              >
                Sign In
              </Button>
            </div>
          )}
        </>
      )}
      <Modal
        theme={customTheme}
        dismissible
        position={"center"}
        show={openModal === "dismissible"}
        onClose={() => setOpenModal(undefined)}
      >
        {/* <Modal.Header>Create Account or Log In</Modal.Header> */}
        {connected ? (
          <Modal.Body className="rounded-lg bg-zinc-900">
            <div className="flex flex-col space-y-4 text-white">
              <div className="flex flex-col">
                <div className="text-lg font-extrabold">Verify Wallet</div>
                {useLedger ? (
                  <div className="text-zinc-500">
                    Send a transaction to yourself to prove ownership of wallet
                  </div>
                ) : (
                  <div className="text-zinc-500">
                    Sign a message to prove ownership of wallet
                  </div>
                )}
              </div>
              <div className="flex flex-row gap-8">
                <label className="relative mb-5 inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={useLedger}
                    className="peer sr-only"
                    onChange={() => setUseLedger(!useLedger)}
                  />
                  <div className="peer h-5 w-9 rounded-full bg-zinc-800 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-pink-800 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-500 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-pink-800"></div>
                  <span className="ml-3 text-sm font-extrabold text-zinc-400 dark:text-gray-300">
                    Using Ledger?
                  </span>
                </label>
              </div>
              <div className="flex gap-4">
                <button
                  className="rounded-lg bg-violet-900 px-4 py-3 font-medium"
                  onClick={() => handleDisconnect()}
                >
                  Change Wallet
                </button>
                {useLedger ? (
                  <button
                    className="rounded-lg bg-pink-800 px-4 py-3 font-medium"
                    onClick={() => handleSignIn(true)}
                  >
                    Sign Transaction
                  </button>
                ) : (
                  <button
                    className="rounded-lg bg-sky-800 px-4 py-3 font-medium"
                    onClick={() => handleSignIn(false)}
                  >
                    Sign Message
                  </button>
                )}
              </div>
              <div>
                <span className="text-sm font-bold">Current Wallet: </span>
                <span className="ml-2 text-sm text-zinc-500">
                  {connected
                    ? truncateAccount(publicKey?.toString() || "")
                    : "Not Connected"}
                </span>
              </div>
            </div>
          </Modal.Body>
        ) : (
          <Modal.Body>
            <div className="bg-zinc-900 text-white">
              <div className="text-lg font-extrabold ">
                Create Account or Log in
              </div>
              <div className="mb-3 text-zinc-500">
                Signing in allows you to bind your name and socials to your
                herd.
              </div>
              <WalletMultiButtonDynamic
                style={{ backgroundColor: "#0369a1", borderRadius: "8px" }}
              />
              {/* <Spinner aria-label="Info spinner example" color="info" /> */}
              <div className="mt-6 flex flex-col">
                <div className="text-lg font-extrabold">
                  Already have an account?
                </div>
                <div className="mb-3 text-zinc-500">
                  Log in with your linked Twitter or Discord account.
                </div>
                <div className="flex flex-row justify-start gap-4">
                  <button
                    className="rounded-lg bg-zinc-800 px-4 py-3 text-white"
                    onClick={() => signIn("discord")}
                  >
                    <div className="flex flex-row justify-center gap-2">
                      <Image
                        src="/icons/discord.svg"
                        alt="Discord"
                        width={24}
                        height={24}
                      />
                      <div className="flex flex-row font-medium">
                        Discord
                        <span className="hidden md:block">&nbsp;Login</span>
                      </div>
                    </div>
                  </button>
                  <button
                    className="rounded-lg bg-zinc-800 px-4 py-3 text-white"
                    onClick={() => signIn("twitter")}
                  >
                    <div className="flex flex-row justify-center gap-2">
                      <Image
                        src="/icons/twitter.svg"
                        alt="Twitter"
                        width={24}
                        height={24}
                      />
                      <div className="flex flex-row font-medium">
                        Twitter
                        <span className="hidden md:block">&nbsp;Login</span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </Modal.Body>
        )}

        {/* <Modal.Footer>
          <Button onClick={() => props.setOpenModal(undefined)}>
            I accept
          </Button>
          <Button color="gray" onClick={() => props.setOpenModal(undefined)}>
            Decline
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
}
