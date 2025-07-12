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
  Rating,
  Paper,
  Divider,
  ActionIcon,
  Tooltip,
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
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Container size="xl" py="xl">
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Skeleton height={600} radius="xl" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Stack gap="lg">
                <Skeleton height={60} radius="md" />
                <Skeleton height={30} width="60%" radius="md" />
                <Skeleton height={20} width="40%" radius="md" />
                <Skeleton height={100} radius="md" />
                <Skeleton height={40} width="80%" radius="md" />
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
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Container size="xl" py="xl">
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper radius="xl" p="md" shadow="xl">
              <Image
                radius="lg"
                src={movieData.poster?.url}
                alt={movieData.name || movieData.alternativeName}
                fallbackSrc="https://images.unsplash.com/photo-1489599735734-79b4169c2a78?w=400&h=600&fit=crop"
                style={{
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                }}
              />
            </Paper>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Paper radius="xl" p="xl" shadow="xl" h="100%">
              <Stack gap="lg">
                <Flex justify="space-between" align="flex-start">
                  <Box flex={1}>
                    <Text size="xl" fw={700} mb="xs">
                      {movieData.name || movieData.alternativeName}
                    </Text>
                    {movieData.alternativeName && movieData.name && (
                      <Text size="lg" c="dimmed" mb="md">
                        {movieData.alternativeName}
                      </Text>
                    )}
                  </Box>
                  
                  <Tooltip label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}>
                    <ActionIcon
                      variant={isFavorite ? "filled" : "outline"}
                      color={isFavorite ? "red" : "gray"}
                      size="xl"
                      radius="xl"
                      onClick={toggleFavorite}
                    >
                      {isFavorite ? <FaHeart size={20} /> : <CiHeart size={22} />}
                    </ActionIcon>
                  </Tooltip>
                </Flex>

                <Group gap="lg">
                  <Flex align="center" gap="xs">
                    <Rating value={movieData.rating.kp / 2} fractions={2} readOnly />
                    <Text fw={600} size="lg">
                      {movieData.rating.kp.toFixed(1)}
                    </Text>
                  </Flex>
                  
                  <Badge
                    leftSection={<FaCalendar size={12} />}
                    variant="light"
                    size="lg"
                    color="blue"
                  >
                    {movieData.year}
                  </Badge>
                </Group>

                <Divider />

                <Box>
                  <Text fw={600} mb="sm" size="lg">
                    Жанры
                  </Text>
                  <Group gap="xs">
                    {movieData.genres.map((genre) => (
                      <Badge
                        key={genre.name}
                        variant="gradient"
                        gradient={{ from: "violet", to: "purple" }}
                        size="md"
                      >
                        {genre.name}
                      </Badge>
                    ))}
                  </Group>
                </Box>

                {movieData.description && (
                  <>
                    <Divider />
                    <Box>
                      <Text fw={600} mb="sm" size="lg">
                        Описание
                      </Text>
                      <Text size="md" style={{ lineHeight: 1.6 }}>
                        {movieData.description}
                      </Text>
                    </Box>
                  </>
                )}

                <Divider />

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