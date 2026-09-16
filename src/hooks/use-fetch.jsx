import { useState } from "react";
import { useSession } from "@clerk/react";

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { session, isLoaded } = useSession();

  const fn = async (...args) => {
    if (!isLoaded || !session) {
      console.log("Session not ready yet");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await cb(session, options, ...args);

      console.log("API response:", response);

      setData(response);
    } catch (error) {
      console.error("useFetch error:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    fn,
    data,
    loading,
    error,
  };
};

export default useFetch;