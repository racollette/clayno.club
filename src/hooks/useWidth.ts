import { type RefObject, useEffect, useState } from "react";

export const useWidth = (ref: RefObject<HTMLDivElement>) => {
  const [elementWidth, setElementWidth] = useState(ref.current?.offsetWidth);

  useEffect(() => {
    // Initial update
    const updateWidth = () => {
      if (ref.current) {
        setElementWidth(ref.current.offsetWidth);
      }
    };
    updateWidth();

    // Listen for the window resize event
    window.addEventListener("resize", updateWidth);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return { elementWidth };
};
