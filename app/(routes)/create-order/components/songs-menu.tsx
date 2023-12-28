"use client";

import useSongs from "@/hooks/useSongs";
import { Album } from "@/types";
import React from "react";
import SongsList from "./songs-list";
import _ from "lodash";
import useOrderMenu from "@/hooks/useOrderMenu";

interface SongsMenuProps {
  AlbumId?: Album;
}

const SongsMenu: React.FC<SongsMenuProps> = ({ AlbumId }) => {
  const { data } = useSongs(AlbumId?.id);
  const songsData: Album[] = data?.items;
  const { setSongsCount, songsCount, setCheckedSongs, checkedSongs } = useOrderMenu();

  const handleCheckboxChange = (label: string, isChecked: boolean) => {
    setCheckedSongs(label);

    setSongsCount(isChecked ? songsCount + 1 : songsCount - 1);
  };

  if (_.isEmpty(songsData)) {
    return null;
  }
  return (
    <div className="flex flex-col border border-white w-full p-4 rounded-md gap-4 max-h-60 overflow-y-scroll scroll-track-[#121212] scrollbar-w-1.5 scrollbar-rounded-md scrollbar scrollbar-thumb-rounded-md scrollbar-thumb-green-500">
      {songsData?.map((data, index) => (
        <SongsList
          key={index}
          label={data?.name}
          onCheckBoxChange={handleCheckboxChange}
        />
      ))}
    </div>
  );
};

export default SongsMenu;
