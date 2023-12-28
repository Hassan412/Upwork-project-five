import { create } from "zustand";

export interface useOrderMenuInterface {
    songsCount: number;
    setSongsCount: (count: number)=> void;
    checkedSongs: string[];
    setCheckedSongs: (song: string)=> void;
    PlayValue: number;
    setPlaysValue: (count: number)=> void;
    FollowerValue: number;
    setFollowerValue: (count: number)=> void;
    SaveValue: number;
    setSavesValue:(count: number)=> void;
    ListenerValue:number;
    setListenerValue: (count: number)=> void;
}

const useOrderMenu = create<useOrderMenuInterface>((set)=> ({
    songsCount: 1,
    setSongsCount: (count: number) => set(()=> ({songsCount: count})),
    checkedSongs: [],
    setCheckedSongs: (song: string) => set((state) => ({ checkedSongs: [...state.checkedSongs, song] })),
    PlayValue: 0,
    setPlaysValue: (count: number) => set(()=> ({PlayValue: count})),
    SaveValue: 0,
    setSavesValue: (count: number) => set(()=> ({SaveValue: count})),
    FollowerValue: 0,
    setFollowerValue:(count: number) => set(()=> ({FollowerValue: count })),
    ListenerValue: 0,
    setListenerValue:(count: number) => set(()=> ({ListenerValue: count }))

}))

export default useOrderMenu;