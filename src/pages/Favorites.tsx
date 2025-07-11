import { Center, SimpleGrid } from "@mantine/core";
import MovieCard from "../components/MovieCard";
import { useFavoritesMovies } from "../hooks/useFavoritesMovies";

export default function Page() {
  const [favorites] = useFavoritesMovies();
  return (
    <>
      {favorites?.length ? (
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
        >
          {favorites.map((movie) => (
            <MovieCard key={movie.id} {...movie} />
          ))}
        </SimpleGrid>
      ) : (
        <Center h={100} bg="var(--mantine-color-gray-light)">
          Не найдено
        </Center>
      )}
    </>
  );
}
