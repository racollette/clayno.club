import Head from "next/head";
import HoldersDataTable from "~/components/HoldersDataTable";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/@/components/ui/select";
import { CLASSES, SKINS, COLORS, SPECIES } from "~/utils/constants";
import { extractProfileFromUser } from "~/utils/wallet";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

type FilterTraits = {
  species: string;
  skin: string;
  color: string;
  class: string;
  tribe: string;

  [key: string]: string;
};

type Owner = {
  userId: string | null;
  username: string | null;
  userHandle: string | null;
  userPFP: string | null;
  wallets: string[];
};

const Holders = () => {
  const searchParams = useSearchParams();

  const tribeParam = searchParams.get("tribe") || "all";
  const skinParam = searchParams.get("skin") || "all";
  const speciesParam = searchParams.get("species") || "all";
  const colorParam = searchParams.get("color") || "all";
  const classParam = searchParams.get("class") || "all";

  const searchTraits: FilterTraits = {
    tribe: tribeParam,
    skin: skinParam,
    species: speciesParam,
    color: colorParam,
    class: classParam,
  };

  const { data: tribes } = api.subdao.getAllSubDAOs.useQuery();
  const { data: holders } =
    api.stats.getDinoHoldersByTrait.useQuery(searchTraits);

  const { data: ccHolders } =
    api.stats.getDinoHoldersByCount.useQuery(searchTraits);

  const { data: users } = api.binding.getAllUsers.useQuery();

  const tableType = searchTraits.tribe === "cc" ? ccHolders : holders;
  const tableData = tableType?.map((holder) => {
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
        og: number;
        saga: number;
        clay: number;
        claymakers: number;
      }[],
      holder: {
        owner: Owner;
        address: string | null;
        og: number;
        saga: number;
        clay: number;
        claymakers: number;
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
          existingEntry.og += holder.og;
          existingEntry.saga += holder.saga;
          existingEntry.clay += holder.clay;
          existingEntry.claymakers += holder.claymakers;
          existingEntry.owner.wallets.push(holder.address ?? "");
        }
      }

      return accumulator;
    },
    []
  );

  updatedTableData?.sort((a, b) => b.og - a.og);

  return (
    <div className="w-full">
      <Head>
        <title>DinoHerd | Holders</title>
      </Head>
      <section className="flex w-full flex-col items-center justify-center gap-8 font-clayno md:px-4 ">
        <div className="flex flex-row flex-wrap gap-2">
          <FilterSelect
            searchTraits={searchTraits}
            data={COLORS}
            type="color"
            value={colorParam}
          />
          <FilterSelect
            searchTraits={searchTraits}
            data={SKINS}
            type="skin"
            value={skinParam}
          />
          <FilterSelect
            searchTraits={searchTraits}
            data={SPECIES}
            type="species"
            value={speciesParam}
          />
          <FilterSelect
            searchTraits={searchTraits}
            data={CLASSES}
            type="class"
            value={classParam}
          />
          <FilterSelect
            searchTraits={searchTraits}
            data={tribes}
            type="tribe"
            value={tribeParam}
          />
        </div>
        <div className="container mx-auto max-w-5xl px-0 py-2 pb-24">
          {holders && <HoldersDataTable data={updatedTableData} />}
        </div>
      </section>
    </div>
  );
};

export default Holders;

type FilterSelectProps = {
  searchTraits: FilterTraits;
  data: any;
  type: string;
  value?: string;
};

function FilterSelect({ searchTraits, data, type, value }: FilterSelectProps) {
  const router = useRouter();
  const handleSelectChange = (newValue: string) => {
    const queryParams = {
      ...searchTraits,
      [type]: newValue !== "all" ? newValue : undefined,
    };

    const queryString = Object.entries(queryParams)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    router.push({
      pathname: router.pathname,
      query: queryString ? `tab=dinos&${queryString}` : "tab=dinos",
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <p className="font-clayno text-xs text-neutral-500 md:text-sm">{type}</p>
      <Select
        value={value}
        onValueChange={(newValue) => handleSelectChange(newValue)}
      >
        <SelectTrigger
          className={`${
            type === "tribe"
              ? `w-[150px] md:w-[175px]`
              : `w-[110px] md:w-[135px]`
          } bg-black font-clayno text-xs text-white md:text-sm`}
        >
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent className="bg-black font-clayno text-sm text-white">
          <SelectItem value="all">All</SelectItem>
          {type === "tribe" ? (
            <>
              {data?.map((trait: any) => (
                <SelectItem key={trait.id} value={trait.acronym}>
                  {trait.name}
                </SelectItem>
              ))}
            </>
          ) : (
            <>
              {data.map((trait: string) => (
                <SelectItem key={trait} value={trait.toLowerCase()}>
                  {trait}
                </SelectItem>
              ))}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
