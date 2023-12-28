interface Image {
  height: number;
  width: number;
  url: string
}

export interface ArtistData {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
};

export interface Album {
  album_group: string;
  album_type: string;
  available_markets: string[]; 
  external_urls: { spotify: string };
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
};

interface Links {
  href: string,
  label: string
}

 export interface Footer {
  Cards: string[];
  Links: Links[];
}