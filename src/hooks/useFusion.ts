import { useState } from "react";
import axios from "axios";

const useFusion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const doFusion = async (id: string, audioClipId?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `https://api.dinoherd.cc/queue-job/${id}?audio=${audioClipId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          // timeout: 300000, // Set the timeout to 6 seconds (adjust as needed)
          // signal: AbortSignal.timeout(300000),
          // responseType: "arraybuffer", // Specify the response type as arraybuffer
        }
      );

      if (response.status !== 200) {
        throw new Error("Collage upload failed.");
      }

      setIsLoading(false);

      return response; // Return the Axios response object
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
      throw err; // Re-throw the error for the caller to handle
    }
  };

  const jobStatus = async (id: string) => {
    try {
      const response = await axios.get(
        `https://api.dinoherd.cc/job-progress/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Job status check failed");
      }

      return response; // Return the Axios response object
    } catch (err: any) {
      setError(err.message);
      throw err; // Re-throw the error for the caller to handle
    }
  };

  return { doFusion, jobStatus, isLoading, error };
};

export default useFusion;
