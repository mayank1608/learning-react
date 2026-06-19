import { useEffect, useState } from "react";

const useFetch = (url: string, payload?: any) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(url, {
          method: payload ? "POST" : "GET",
          headers: {
            "Content-Type": "application/json",
          },
          body: payload ? JSON.stringify(payload) : undefined,
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, JSON.stringify(payload)]); // payload dependency

  return { data, loading, error };
};

export default useFetch;