import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button, type CustomFlowbiteTheme, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import bs58 from "bs58";
import { getCsrfToken } from "next-auth/react";
import { SigninMessage } from "~/utils/SigninMessage";
import { buildAuthTx, validateAuthTx } from "~/utils/authTx";
import { connection } from "~/server/rpc";
import { getBaseUrl, type api } from "~/utils/api";
import { truncateAccount } from "~/utils/addresses";

const customTheme: CustomFlowbiteTheme["modal"] = {
  content: {
    inner: "bg-zinc-900 rounded-lg",
  },
};

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

type AddWalletModalProps = {
  linkWallet: ReturnType<typeof api.binding.linkWallet.useMutation>;
  userId: string;
};

export default function AddWalletModal(props: AddWalletModalProps) {
  const { linkWallet, userId } = props;
  const { publicKey, signMessage, disconnect, connected, signTransaction } =
    useWallet();
  const [openModal, setOpenModal] = useState<string | undefined>();
  // const [signing, setSigning] = useState<boolean>(false);
  const [useLedger, setUseLedger] = useState<boolean>(false);
  const walletModal = useWalletModal();

  const handleAddWallet = async (useLedger: boolean) => {
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

        if (userId && validSignature) {
          linkWallet.mutate({
            id: userId,
            wallet: publicKey?.toString(),
          });
        }
      } else {
        const message = new SigninMessage({
          domain: getBaseUrl(),
          publicKey: publicKey?.toBase58(),
          statement: `Rawr!\n \n Sign this message to log in to the app.\n`,
          nonce: csrf,
        });
        const data = new TextEncoder().encode(message.prepare());
        const signature = await signMessage(data);
        const serializedSignature = bs58.encode(signature);
        if (userId && serializedSignature) {
          linkWallet.mutate({
            id: userId,
            wallet: publicKey?.toString(),
          });
        }
      }

      // setSigning(false);
      setOpenModal(undefined);
    } catch (error) {
      console.log(error);
      // setSigning(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <>
      <Button
        onClick={() => {
          handleDisconnect();
          setOpenModal("dismissible");
        }}
      >
        Add New Wallet
      </Button>
      <Modal
        theme={customTheme}
        dismissible
        show={openModal === "dismissible"}
        onClose={() => setOpenModal(undefined)}
      >
        {/* <Modal.Header>Create Account or Log In</Modal.Header> */}
        <Modal.Body className="rounded-lg bg-zinc-900">
          <div className="flex flex-col space-y-4 text-white">
            <div className="flex flex-col">
              <div className="text-lg font-extrabold">Add a Wallet</div>

              {useLedger ? (
                <div className="text-zinc-500">
                  Send a transaction to yourself to link this wallet to your
                  profile
                </div>
              ) : (
                <div className="text-zinc-500">
                  Sign a message to link this wallet to your profile
                </div>
              )}
            </div>
            <div className="flex flex-row gap-8">
              <label className="relative mb-5 inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  value=""
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
              {connected ? (
                <button
                  className="rounded-lg bg-violet-900 px-4 py-3 font-medium"
                  onClick={() => handleDisconnect()}
                >
                  Change Wallet
                </button>
              ) : (
                <WalletMultiButtonDynamic />
                // <WalletModal />
              )}

              {useLedger ? (
                <button
                  className="rounded-lg bg-pink-800 px-4 py-3 font-medium"
                  onClick={() => handleAddWallet(true)}
                >
                  Sign Transaction
                </button>
              ) : (
                <button
                  className="rounded-lg bg-sky-800 px-4 py-3 font-medium"
                  onClick={() => handleAddWallet(false)}
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
      </Modal>
    </>
  );
}
