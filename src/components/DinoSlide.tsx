import { useUser } from "~/hooks/useUser";
import { api } from "~/utils/api";
import Image from "next/image";

export default function DinoSlide() {
  const { user, session, isLoading } = useUser();

  const wallets = user?.wallets.map((wallet: any) => wallet.address) ?? [];

  const { data: holders } = api.fuser.getUserDinos.useQuery({
    wallets: wallets,
  });

  console.log(user);
  console.log(wallets);
  console.log(holders);

  return (
    <div>
      {user && session ? (
        <div>
          <div>My Dinos</div>
          {holders?.map((holder) => (
            <div className="flex flex-row flex-wrap">
              {holder.mints.map((dino) => (
                <div className="relative h-32 w-32 overflow-clip rounded-md">
                  <Image
                    src={`https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${dino.gif}`}
                    alt=""
                    fill
                    quality={75}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div>Log in</div>
      )}
    </div>
  );
}
