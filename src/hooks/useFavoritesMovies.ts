import { useLocalStorage } from "@mantine/hooks";
import type { Movie } from "../types";
import superjson from "superjson";

export function useFavoritesMovies() {
  return useLocalStorage<Movie[]>({
    key: "favoritesMovies",
    defaultValue: [],
    serialize: superjson.stringify,
    deserialize: (str) => (str === undefined ? [] : superjson.parse(str)),
  });
}
