import { Dropdown } from "flowbite-react";
import { HiCog, HiLogout, HiViewGrid, HiUser } from "react-icons/hi";
import Image from "next/image";
import { useRouter } from "next/router";
import { handleUserPFPDoesNotExist } from "~/utils/images";
import { shortAccount } from "~/utils/addresses";
import { Skeleton } from "~/@/components/ui/skeleton";

type ProfileButtonProps = {
  imageURL: string;
  username: string;
  handleSignout: () => void;
  sessionKey: string;
  isLoading?: boolean;
};

export default function ProfileButton(props: ProfileButtonProps) {
  const { imageURL, username, handleSignout, sessionKey, isLoading } = props;
  const router = useRouter();

  const displayName = username?.length > 30 ? shortAccount(username) : username;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-neutral-800 px-3 py-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="hidden h-5 w-24 md:block" />
      </div>
    );
  }

  return (
    <Dropdown
      className="m-0 border-none bg-transparent p-0 font-clayno"
      inline={true}
      arrowIcon={false}
      label={
        <div className="flex items-center gap-2 rounded-lg bg-neutral-800 px-3 py-2 transition-all hover:bg-neutral-700">
          <div className="relative h-6 w-6 overflow-hidden rounded-full ring-2 ring-neutral-600">
            <Image
              className="object-cover"
              src={imageURL}
              alt="Avatar"
              fill
              sizes="24px"
              onError={handleUserPFPDoesNotExist}
            />
          </div>
          <div className="hidden font-clayno text-sm text-neutral-200 md:block">
            {displayName}
          </div>
        </div>
      }
      dismissOnClick={true}
    >
      <div className="rounded-lg border border-neutral-700 bg-neutral-800 p-1 shadow-lg">
        <Dropdown.Item
          className="rounded-md px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-700 hover:text-white focus:bg-neutral-700"
          icon={HiViewGrid}
          onClick={() => router.push(`/inventory/${sessionKey}`)}
        >
          Inventory
        </Dropdown.Item>
        <Dropdown.Item
          className="rounded-md px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-700 hover:text-white focus:bg-neutral-700"
          icon={HiCog}
          onClick={() => router.push(`/inventory/${sessionKey}/settings`)}
        >
          Settings
        </Dropdown.Item>
        <Dropdown.Divider className="my-1 bg-neutral-700" />
        <Dropdown.Item
          className="rounded-md px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 focus:bg-red-500/10"
          icon={HiLogout}
          onClick={handleSignout}
        >
          Sign out
        </Dropdown.Item>
      </div>
    </Dropdown>
  );
}
