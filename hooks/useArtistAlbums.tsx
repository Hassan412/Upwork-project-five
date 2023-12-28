import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const GetArtistAlbumsAndSongs = (artistId?: string, albumId?: string) => {
  const { data: albumsData, error: albumsError } = useSWR(
    artistId ? `https://api.spotify.com/v1/artists/${artistId}/albums` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const albums = albumsData?.items || [];
  const { data: epsData, error: epsError } = useSWR(
    artistId
      ? `https://api.spotify.com/v1/artists/${artistId}/albums?album_type=single`
      : null,
    fetcher
  );

  return {
    albums,
    epsData,
    isLoading: !albumsError && !albumsData,
    error: albumsError,
  };
};

export default GetArtistAlbumsAndSongs;
