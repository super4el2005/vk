import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../main";
import { paramsSerializer, type FilterValues, type Movie } from "../utils";
import superjson from "superjson";

type MoviesResponse = {
  docs: Movie[];
  total: number;
  limit: number;
  page: number;
  pages: number;
};

export function useInfiniteMovies(filterValues: Partial<FilterValues> | null) {
  return useInfiniteQuery({
    queryKey: ["movies", superjson.stringify(filterValues)],
    queryFn: ({ pageParam = 1 }) =>
      api.get<MoviesResponse>("/v1.4/movie", {
        params: {
          rating:{
            kp:[1,10]
          },
          ...filterValues,
          limit: 50,
          page: pageParam,
          notNullFields: [
            "name",
            "rating.kp",
            "poster.url",
            "description",
            "genres.name",
            "year",
          ],
        },
        paramsSerializer,
      }),
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.data;
      return page < pages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
