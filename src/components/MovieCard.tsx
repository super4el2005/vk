import {
  Card,
  Image,
  Group,
  Text,
  Flex,
  Badge,
  ActionIcon,
  Box,
  Stack,
} from "@mantine/core";
import type { Movie } from "../utils";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa6";
import { NavLink } from "react-router";
import { useFavoritesMovies } from "../hooks/useFavoritesMovies";

function MovieCard(movie: Movie) {
  const [favorites, setFavorites] = useFavoritesMovies();
  const isFavorite = Boolean(
    favorites?.find((favorite) => favorite.id === movie.id)
  );

  const toggleFavorite = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setFavorites((prev) =>
      isFavorite
        ? prev.filter((favorite) => favorite.id !== movie.id)
        : [...prev, movie]
    );
  };

  return (
    <Card
      key={movie.id}
      shadow="sm"
      padding="md"
      withBorder
      component={NavLink}
      to={`/${movie.id}`}
      style={{
        cursor: "pointer",
        transition: "box-shadow 0.2s ease",
        backgroundColor: "white",
      }}
      className="movie-card"
    >
      <Card.Section>
        <Box pos="relative">
          <Image
            src={movie.poster?.url}
            height={300}
            alt={movie.name || movie.alternativeName}
            fallbackSrc="https://images.unsplash.com/photo-1489599735734-79b4169c2a78?w=400&h=600&fit=crop"
          />
          
          <ActionIcon
            pos="absolute"
            top={8}
            right={8}
            variant={isFavorite ? "filled" : "white"}
            color={isFavorite ? "red" : "gray"}
            size="md"
            onClick={toggleFavorite}
            style={{
              backgroundColor: isFavorite ? undefined : "white",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {isFavorite ? <FaHeart size={14} /> : <CiHeart size={16} />}
          </ActionIcon>
        </Box>
      </Card.Section>

      <Stack gap="xs" mt="md">
        <Text 
          fw={600} 
          size="md" 
          lineClamp={2}
          c="dark"
        >
          {movie.name || movie.alternativeName}
        </Text>
        
        <Flex justify="space-between" align="center">
          <Badge 
            variant="light" 
            color="gray"
            size="sm"
          >
            {movie.year}
          </Badge>
          
          <Text size="sm" fw={500} c="dark">
            {movie.rating.kp.toFixed(1)}
          </Text>
        </Flex>
        
        <Group gap={4}>
          {movie.genres.slice(0, 2).map((genre) => (
            <Badge 
              key={genre.name} 
              variant="outline" 
              size="xs"
              color="gray"
            >
              {genre.name}
            </Badge>
          ))}
          {movie.genres.length > 2 && (
            <Text size="xs" c="dimmed">
              +{movie.genres.length - 2}
            </Text>
          )}
        </Group>
      </Stack>
    </Card>
  );
}

export default MovieCard;