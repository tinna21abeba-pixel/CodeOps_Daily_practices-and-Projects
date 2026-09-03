import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch data with loading/error state management
 * and AbortController cleanup to cancel in-flight requests on dependency change or unmount.
 *
 * @param {string} url - API endpoint to fetch
 * @returns {{ data: any, loading: boolean, error: string | null }}
 */
export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load menu (HTTP ${res.status}). Please try again.`);
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
        setError(null);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Something went wrong while fetching data.');
        }
      })
      .finally(() => {
        setLoading(false);
      });

    // Cleanup: abort previous pending request if url changes or component unmounts
    return () => {
      controller.abort();
    };
  }, [url]);

  return { data, loading, error };
}

export default useFetch;
