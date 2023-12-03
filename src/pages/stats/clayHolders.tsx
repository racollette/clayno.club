import ClayDataTable from "../../components/stats/ClayDataTable";
import { api } from "~/utils/api";
import { extractProfileFromUser } from "~/utils/wallet";

type Owner = {
  userId: string | null;
  username: string | null;
  userHandle: string | null;
  userPFP: string | null;
  wallets: string[];
};

const ClayHolders = () => {
  const { data: clayHolders } = api.stats.getClayHoldersByColor.useQuery();
  const { data: users } = api.binding.getAllUsers.useQuery();

  const tableData = clayHolders?.map((holder) => {
    const user = users?.find((user) =>
      user.wallets.some((wallet) => wallet.address === holder.address)
    );

    let owner: Owner = {
      userId: null,
      username: null,
      userHandle: null,
      userPFP: null,
      wallets: [],
    };

    if (user) {
      const { userId, username, userHandle, userPFP } =
        extractProfileFromUser(user);
      owner = {
        userId,
        username,
        userHandle,
        userPFP,
        wallets: user.wallets.map((wallet) => wallet.address),
      };
    }

    return {
      ...holder,
      owner,
    };
  });

  const updatedTableData = tableData?.reduce(
    (
      accumulator: {
        owner: Owner;
        address: string | null;
        red: number;
        blue: number;
        green: number;
        yellow: number;
        white: number;
        black: number;
        total: number;
      }[],
      holder: {
        owner: Owner;
        address: string | null;
        red: number;
        blue: number;
        green: number;
        yellow: number;
        white: number;
        black: number;
        total: number;
      }
    ) => {
      if (!holder.owner.userId) return [...accumulator, holder];

      const userIndex = accumulator.findIndex(
        (entry) => entry.owner.userId === holder.owner.userId
      );

      if (userIndex === -1) {
        accumulator.push({
          ...holder,
          owner: {
            ...holder.owner,
            wallets: [holder.address ?? ""],
          },
        });
      } else {
        const existingEntry = accumulator[userIndex];
        if (
          existingEntry &&
          !existingEntry?.owner.wallets.includes(holder.address ?? "")
        ) {
          existingEntry.blue += holder.blue;
          existingEntry.green += holder.green;
          existingEntry.yellow += holder.yellow;
          existingEntry.red += holder.red;
          existingEntry.white += holder.white;
          existingEntry.black += holder.black;
          existingEntry.total += holder.total;
          existingEntry.owner.wallets.push(holder.address ?? "");
        }
      }

      return accumulator;
    },
    []
  );

  updatedTableData?.sort((a, b) => b.total - a.total);

  return (
    <div className="w-full">
      <section className="flex w-full flex-col items-center justify-center gap-8 font-clayno md:px-4 ">
        <div className="container mx-auto max-w-5xl px-0 pb-24">
          {clayHolders && <ClayDataTable data={updatedTableData} />}
        </div>
      </section>
    </div>
  );
};

export default ClayHolders;
