import { useUser } from "~/hooks/useUser";
import { api } from "~/utils/api";
import Image from "next/image";
import { HiArrowCircleUp } from "react-icons/hi";
import { Fragment } from "react";

type DinoSlideProps = {
  handlePlace: (imageURL: string, motion: string, mint: string) => void;
  handleDragStart: (
    e: React.DragEvent<HTMLImageElement>,
    imageURL: string,
    motion: string,
    mint: string
  ) => void;
};

export default function DinoSlide({
  handlePlace,
  handleDragStart,
}: DinoSlideProps) {
  const { user, session, isLoading } = useUser();

  const wallets = user?.wallets.map((wallet: any) => wallet.address) ?? [];

  const { data: holders } = api.fuser.getUserDinos.useQuery({
    wallets: wallets,
  });

  return (
    <div className="fixed bottom-0 left-0 h-48 w-full overflow-y-scroll border-t border-stone-400 bg-stone-600">
      <div className="flex p-4">
        {user && session ? (
          <div>
            <div className="flex flex-row flex-wrap gap-2">
              {holders?.map((holder) => (
                <Fragment key={holder.owner}>
                  {holder.mints.map((dino) => (
                    <div
                      key={dino.mint}
                      className="relative flex h-36 w-36 cursor-grab justify-center overflow-clip rounded-md"
                    >
                      <Image
                        src={`https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${dino.gif}`}
                        alt=""
                        fill
                        quality={75}
                        onDragStart={(e) =>
                          handleDragStart(
                            e,
                            e.currentTarget.src,
                            dino.attributes?.motion || "",
                            dino.mint
                          )
                        }
                      />
                      <div
                        onClick={() =>
                          handlePlace(
                            dino.gif,
                            dino.attributes?.motion || "",
                            dino.mint
                          )
                        }
                        className="flex transform cursor-pointer items-center justify-center opacity-0 transition-opacity hover:opacity-100"
                      >
                        <HiArrowCircleUp size={50} />
                      </div>
                    </div>
                  ))}
                </Fragment>
              ))}
            </div>
          </div>
        ) : (
          <div>Log in</div>
        )}
      </div>
    </div>
  );
}
