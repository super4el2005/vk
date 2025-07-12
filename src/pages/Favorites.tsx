import { Center, SimpleGrid, Text, Box, Container } from "@mantine/core";
import MovieCard from "../components/MovieCard";
import { useFavoritesMovies } from "../hooks/useFavoritesMovies";

export default function Page() {
  const [favorites] = useFavoritesMovies();
  
  return (
    <Box
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <Container size="xl" py={30}>
        <Text size="xl" fw={700} mb="xl" ta="center">
          Избранные фильмы
        </Text>
        
        {favorites?.length ? (
          <SimpleGrid
            cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
            spacing="xl"
            verticalSpacing="xl"
          >
            {favorites.map((movie) => (
              <MovieCard key={movie.id} {...movie} />
            ))}
          </SimpleGrid>
        ) : (
          <Center h={400}>
            <Text size="lg" c="dimmed">
              Нет избранных фильмов
            </Text>
          </Center>
        )}
      </Container>
    </Box>
  );
}