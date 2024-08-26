import Layout from "~/components/Layout";
import MetaTags from "~/components/MetaTags";
import Image from "next/image";
import Link from "next/link";

const SignUpTutorial = () => {
  return (
    <>
      <MetaTags title="Clayno.club | How to Sign Up for Gated Access" />
      <Layout>
        <section className="mx-auto max-w-4xl px-0 py-4 md:px-4 md:py-8">
          <h1 className="mb-8 text-center font-clayno text-2xl text-white md:text-3xl">
            How to Join Clayno.club Gated Telegram Groups
          </h1>

          <div className="prose prose-base md:prose-lg mx-auto text-gray-200">
            {/* Step 1: Set Up an Account on Clayno.club */}
            <h2 className="mb-4 text-xl font-bold text-gray-100 md:text-2xl">
              Step 1: Set up an account on Clayno.club
            </h2>
            <ol className="mb-8 list-inside">
              <li className="mb-4">
                <strong>Connect your Solana wallet: </strong>
                On the homepage, click on the {"'Connect Wallet'"} button and
                select your preferred Solana wallet (e.g., Phantom, Backpack,
                etc.).
                <div className="mx-0 my-6 md:mx-8 md:my-8">
                  <Image
                    src="/images/telegramBot/create_account.png"
                    alt="Create Account Screenshot"
                    width={800}
                    height={450}
                    className="rounded-lg shadow-md"
                  />
                  <p className="mt-2 text-center text-xs text-gray-400">
                    Creating your account on Clayno.club
                  </p>
                </div>
              </li>
              <li className="mb-4">
                <strong>Sign a message: </strong>
                After connecting your wallet, follow the prompts to sign a
                message and create your account. Note the ledger toggle option
                if your Claynos are on a hardware wallet.
                <p className="py-2 text-sm font-bold text-pink-500">
                  If you prefer to not sign a transaction with your cold storage
                  device, create an account using any hot wallet and message{" "}
                  <Link
                    target="_blank"
                    className="text-sky-500"
                    href="https://x.com/Decay235"
                  >
                    Decay
                  </Link>{" "}
                  with your ledger address to have it attached to your account
                  manually.
                </p>
                <div className="mx-0 my-6 md:mx-8 md:my-8">
                  <Image
                    src="/images/telegramBot/sign_message.png"
                    alt="Sign Message"
                    width={800}
                    height={450}
                    className="rounded-lg shadow-md"
                  />
                  <p className="mt-2 text-center text-xs text-gray-400">
                    Signing the message to verify account ownership
                  </p>
                </div>
              </li>
            </ol>

            {/* Step 2: Install Telegram */}
            <h2 className="mb-4 text-xl font-bold text-gray-100 md:text-2xl">
              Step 2: Link Telegram
            </h2>
            <p className="mb-8">
              If you don{"'"}t already have Telegram installed on your device,
              you{"'"}ll need to download it from the{" "}
              <a
                href="https://telegram.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                official website
              </a>{" "}
              or from your device{"'"}s app store.
            </p>
            <p className="mb-4">
              <strong>Link Your Telegram Account: </strong>
              While signed in with your wallet, navigate to the {
                "'Settings'"
              }{" "}
              page from your account dashboard. Under the settings, you will
              find an option to link your Telegram account. Follow the
              instructions to complete the linking process.
            </p>
            <div className="mx-0 my-6 md:mx-8 md:my-8">
              <Image
                src="/images/telegramBot/login_with_telegram1.png"
                alt="Login with Telegram"
                width={800}
                height={450}
                className="rounded-lg shadow-md"
              />
              <p className="mt-2 text-center text-xs text-gray-400">
                Logging in with Telegram
              </p>
            </div>
            <p className="mb-8">
              Telegram will prompt you to authenticate the mobile number
              attached to your account. Enter it and press next.
            </p>
            <div className="mx-0 my-6 md:mx-8 md:my-8">
              <Image
                src="/images/telegramBot/verify_number1.png"
                alt="Verify Number Screenshot"
                width={800}
                height={450}
                className="rounded-lg shadow-md"
              />
              <p className="mt-2 text-center text-xs text-gray-400">
                Verifying your number in the bot
              </p>
            </div>
            <p className="mb-8">
              Telegram will now send you a direct message in Telegram.
            </p>
            <div className="mx-0 my-6 md:mx-8 md:my-8">
              <Image
                src="/images/telegramBot/confirm_on_telegram1.png"
                alt="Confirm on Telegram"
                width={800}
                height={450}
                className="rounded-lg shadow-md"
              />
              <p className="mt-2 text-center text-xs text-gray-400">
                Confirming connection in Telegram
              </p>
            </div>
            <p className="mb-8">
              Press confirm to complete linking your Telegram account to your
              Clayno.club account.
            </p>
            <div className="mx-0 my-6 md:mx-8 md:my-8">
              <Image
                src="/images/telegramBot/successful_login1.png"
                alt="Successful Login"
                width={800}
                height={450}
                className="rounded-lg shadow-md"
              />
              <p className="mt-2 text-center text-xs text-gray-400">
                Link complete
              </p>
            </div>
            <p className="mb-8">
              {
                "That's it! X and Discord can also be linked (used to display names next to holdings), but this is optional. You're now ready to chat with the bot."
              }
            </p>
            <div className="mx-0 my-6 md:mx-8 md:my-8">
              <Image
                src="/images/telegramBot/link_socials.png"
                alt="Link Socials Screenshot"
                width={800}
                height={450}
                className="rounded-lg  shadow-md"
              />
              <p className="mt-2 text-center text-xs text-gray-400">
                Link other socials
              </p>
            </div>

            {/* Step 3: Start a Chat with Our Bot */}
            <h2 className="mb-4 text-xl font-bold text-gray-100 md:text-2xl">
              Step 3: Start a chat with the Clayno.club Bot
            </h2>
            <p className="mb-4">
              Once you have Telegram set up and linked to your Clayno.club
              account, click on the following link to start a chat with our bot:{" "}
              <a
                href="https://t.me/ClaynoClubBot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                @ClaynoClubBot
              </a>
              .
            </p>
            <p className="mb-8">
              This will open a conversation where you can be invited to gated
              groups if you hold an eligible Claynosaurz NFT.
            </p>
            <div className="mx-0 my-6 md:mx-8 md:my-8">
              <Image
                src="/images/telegramBot/speak_with_bot.png"
                alt="Speak with Bot Screenshot"
                width={800}
                height={450}
                className="rounded-lg shadow-md"
              />
              <p className="mt-2 text-center text-xs text-gray-400">
                Starting a chat with the Telegram bot
              </p>
            </div>

            {/* Step 5: Join the Gated Groups */}
            <h2 className="mb-4 text-xl font-bold text-gray-100 md:text-2xl">
              Step 4: Join a group!
            </h2>
            <p className="mb-8">
              {
                "Simply follow the prompts to check your account status and see if you're eligible to join any of the gated groups."
              }
            </p>
            <div className="mx-0 my-6 md:mx-8 md:my-8">
              <Image
                src="/images/telegramBot/select_group.png"
                alt="Select Group Screenshot"
                width={800}
                height={450}
                className="rounded-lg shadow-md"
              />
              <p className="mt-2 text-center text-xs text-gray-400">
                Selecting the group you want to join
              </p>
              <p className="pt-4 font-bold text-pink-500">
                {
                  "To be eligible, your connected wallets must hold the required NFTs. If you are having problems, check your Clayno.club profile settings to make sure it was connected properly."
                }
              </p>
            </div>
            <p className="mb-8">
              {
                "If you're eligible, the bot will generate a unique invite link for you. Click 'Join' and you're in!"
              }
            </p>
            <div className="mx-0 my-6 md:mx-8 md:my-8">
              <Image
                src="/images/telegramBot/verify_holdings_and_join.png"
                alt="Verify Holdings and Join Screenshot"
                width={800}
                height={450}
                className="rounded-lg shadow-md"
              />
              <p className="mt-2 text-center text-xs text-gray-400">
                Checking your eligibility and joining
              </p>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default SignUpTutorial;
