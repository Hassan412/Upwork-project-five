"use client";

import useSWR from "swr";
import axios from "axios";
import getToken from "../lib/getToken";

const SearchArtists = (query: string) => {
  const { data, error } = useSWR(
    query ? `https://api.spotify.com/v1/search?q=${query}&type=artist` : null,
    async (url) => {
      if (!url) {
        return null;
      }

      try {
        const token = await getToken();

        const searchResponse = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return searchResponse.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    },
    {
      revalidateOnFocus: false,
    }
  );

  return {
    data: data?.artists?.items || [],
    isLoading: !error && !data,
    error,
  };
};

export { SearchArtists };
