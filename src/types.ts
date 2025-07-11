export type Movie = {
  id: number;
  name: string;
  alternativeName: string;
  genres: {
    name: string;
  }[];
  year: number;
  rating: {
    kp: number;
  };
  poster?: {
    url: string;
    previewUrl: string;
  };
};

export type Genre = {
  name: string;
  slug: string;
};
