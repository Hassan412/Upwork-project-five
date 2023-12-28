import { SearchArtists } from "@/hooks/useSearchArtist";
import { ArtistData } from "@/types";
import React, { useEffect } from "react";
import _ from "lodash";
import SearchItem from "./Search-item";

const SearchMenu = ({ Query }: { Query: string }) => {
  const { data } = SearchArtists(Query);
  const ArtistData: ArtistData[] = data;
  useEffect(() => {
    console.log(data);
  }, [data]);
  if (_.isEmpty(data)) {
    return null;
  }

  return (
    <div className="absolute top-[105%] z-50 right-0 left-0 h-80 rounded-md scrollbar-w-1.5 scrollbar-rounded-md overflow-y-scroll scrollbar scrollbar-thumb-rounded-md scrollbar-track-neutral-400 scrollbar-thumb-[#6151EE]">
      {ArtistData.map((data, index) => (
        <SearchItem
          key={index}
          label={data?.name}
          Url={data?.images[0]?.url}
          Followers={data?.followers.total}
          ArtistId={data?.id}
        />
      ))}
    </div>
  );
};

export default SearchMenu;
