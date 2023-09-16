import { useState } from "react";

type PayloadProps = {
  columns: number;
  rows: number;
  borderWidth: number;
  borderColor: string;
  data: { motion: string; mint: string }[];
};

const useFusion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const doFusion = async (payload: PayloadProps) => {
    setIsLoading(true);
    setError(null);

    console.log(payload);

    try {
      const response = await fetch("https://api.dinoherd.cc/collage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Collage upload failed.");
      }

      // You can handle the response here if needed

      return response;

      setIsLoading(false);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return { doFusion, isLoading, error };
};

export default useFusion;
