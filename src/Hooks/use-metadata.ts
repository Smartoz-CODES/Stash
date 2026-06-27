import { useState, useCallback } from "react";
import { supabase } from "../Lib/supabase";

export interface MetadataResult {
  title: string | null;
  description: string | null;
  thumbnailUrl: string | null;
}

const EDGE_FUNCTION_URL =
  "https://huvfiwdhkjnmozkriszc.supabase.co/functions/v1/fetch-metadata";

export const useMetadata = () => {
  const [loading, setLoading] = useState(false);

  // useCallback keeps the function reference stable so it can safely
  // be added to useEffect dependency arrays without causing infinite loops
  const fetchMetadata = useCallback(
    async (url: string): Promise<MetadataResult | null> => {
      if (!url) return null;

      setLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          console.error("Metadata fetch: no active session");
          return null;
        }

        const response = await fetch(EDGE_FUNCTION_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ url }),
        });

        // Log the full response in dev so we can see what the Edge Function returns
        if (!response.ok) {
          const errText = await response.text();
          console.error(
            `Metadata fetch failed — status ${response.status}:`,
            errText,
          );
          return null;
        }

        const data = await response.json();
        console.log("Metadata response:", data);

        return {
          title: data.title || null,
          description: data.description || null,
          thumbnailUrl: data.thumbnailUrl || null,
        };
      } catch (err) {
        console.error("Metadata fetch error:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { fetchMetadata, loading };
};
