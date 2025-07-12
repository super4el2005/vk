import { useParams } from "react-router";
import { api } from "../main";
import type { Movie } from "../utils";
import { 
  Grid, 
  Image, 
  Skeleton, 
  Stack, 
  Flex, 
  Text, 
  Badge, 
  Group, 
  Container,
  Box,
  Paper,
  ActionIcon,
  Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useFavoritesMovies } from "../hooks/useFavoritesMovies";
import { CiHeart } from "react-icons/ci";
import { FaHeart, FaCalendar, FaClock, FaGlobe } from "react-icons/fa6";

export default function Page() {
  const params = useParams();
  const [favorites, setFavorites] = useFavoritesMovies();
  
  const movie = useQuery({
    queryKey: ["movie", params.id],
    queryFn: () => api.get<Movie>(`/v1.4/movie/${params.id}`),
  });

  const movieData = movie.data?.data;
  const isFavorite = Boolean(
    movieData && favorites?.find((favorite) => favorite.id === movieData.id)
  );

  const toggleFavorite = () => {
    if (!movieData) return;
    setFavorites((prev) =>
      isFavorite
        ? prev.filter((favorite) => favorite.id !== movieData.id)
        : [...prev, movieData]
    );
  };

  if (movie.isLoading) {
    return (
      <Box
        style={{
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <Container size="xl" py="xl">
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Skeleton height={600} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Stack gap="lg">
                <Skeleton height={60} />
                <Skeleton height={30} width="60%" />
                <Skeleton height={20} width="40%" />
                <Skeleton height={100} />
                <Skeleton height={40} width="80%" />
              </Stack>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
    );
  }

  if (!movieData) {
    return (
      <Container size="xl" py="xl">
        <Text ta="center" size="xl">Фильм не найден</Text>
      </Container>
    );
  }

  return (
    <Box
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Container size="xl" py="xl">
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper shadow="sm" p="md" withBorder>
              <Image
                src={movieData.poster?.url}
                alt={movieData.name || movieData.alternativeName}
                fallbackSrc="https://images.unsplash.com/photo-1489599735734-79b4169c2a78?w=400&h=600&fit=crop"
              />
            </Paper>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Paper shadow="sm" p="xl" withBorder h="100%">
              <Stack gap="lg">
                <Flex justify="space-between" align="flex-start">
                  <Box flex={1}>
                    <Title order={1} mb="xs" c="dark">
                      {movieData.name || movieData.alternativeName}
                    </Title>
                    {movieData.alternativeName && movieData.name && (
                      <Text size="lg" c="dimmed" mb="md">
                        {movieData.alternativeName}
                      </Text>
                    )}
                  </Box>
                  
                  <ActionIcon
                    variant={isFavorite ? "filled" : "outline"}
                    color={isFavorite ? "red" : "gray"}
                    size="xl"
                    onClick={toggleFavorite}
                  >
                    {isFavorite ? <FaHeart size={20} /> : <CiHeart size={22} />}
                  </ActionIcon>
                </Flex>

                <Group gap="lg">
                  <Text fw={600} size="xl" c="dark">
                    {movieData.rating.kp.toFixed(1)}
                  </Text>
                  
                  <Badge
                    leftSection={<FaCalendar size={12} />}
                    variant="light"
                    size="lg"
                    color="blue"
                  >
                    {movieData.year}
                  </Badge>
                </Group>

                <Box>
                  <Text fw={600} mb="sm" size="lg" c="dark">
                    Жанры
                  </Text>
                  <Group gap="xs">
                    {movieData.genres.map((genre) => (
                      <Badge
                        key={genre.name}
                        variant="outline"
                        size="md"
                        color="gray"
                      >
                        {genre.name}
                      </Badge>
                    ))}
                  </Group>
                </Box>

                {movieData.description && (
                  <Box>
                    <Text fw={600} mb="sm" size="lg" c="dark">
                      Описание
                    </Text>
                    <Text size="md" style={{ lineHeight: 1.6 }} c="dark">
                      {movieData.description}
                    </Text>
                  </Box>
                )}

                <Group gap="xl">
                  {movieData.movieLength && (
                    <Flex align="center" gap="xs">
                      <FaClock color="#666" />
                      <Text c="dimmed">
                        {Math.floor(movieData.movieLength / 60)}ч {movieData.movieLength % 60}м
                      </Text>
                    </Flex>
                  )}
                  
                  {movieData.countries && movieData.countries.length > 0 && (
                    <Flex align="center" gap="xs">
                      <FaGlobe color="#666" />
                      <Text c="dimmed">
                        {movieData.countries.map(c => c.name).join(", ")}
                      </Text>
                    </Flex>
                  )}
                </Group>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}