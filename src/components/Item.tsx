import Image from "next/image";
import { useState } from "react";

type ItemProps = {
  id: string;
  item: any;
};

export const Item = ({ id, item }: ItemProps) => {
  const [showPFP, setShowPFP] = useState(false);

  return (
    <div
      key={item.mint}
      className={`relative flex h-28 w-28 cursor-grab justify-center overflow-clip rounded-md lg:h-36 lg:w-36`}
    >
      <Image
        className="transform-gpu transition-transform hover:scale-125"
        src={
          item.mint !== "clayno_logo_vertical_1024x1024"
            ? `https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${
                showPFP ? item.pfp : item.gif
              }`
            : item.pfp
        }
        alt=""
        fill
        quality={75}
      />
    </div>
  );
};
