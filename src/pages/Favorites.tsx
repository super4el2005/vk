import { Center, SimpleGrid, Text, Box, Container, Title } from "@mantine/core";
import MovieCard from "../components/MovieCard";
import { useFavoritesMovies } from "../hooks/useFavoritesMovies";

export default function Page() {
  const [favorites] = useFavoritesMovies();
  
  return (
    <Box
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Container size="xl" py="xl">
        <Title order={2} mb="xl" ta="center" c="dark">
          Избранные фильмы
        </Title>
        
        {favorites?.length ? (
          <SimpleGrid
            cols={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
            spacing="lg"
            verticalSpacing="lg"
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