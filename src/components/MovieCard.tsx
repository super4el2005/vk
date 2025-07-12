import {
  Card,
  Image,
  Group,
  Text,
  Flex,
  Badge,
  Tooltip,
  ActionIcon,
  Box,
  Stack,
  Rating,
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
      shadow="lg"
      padding={0}
      radius="xl"
      withBorder
      component={NavLink}
      to={`/${movie.id}`}
      style={{
        overflow: "hidden",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      className="movie-card"
    >
      <Box pos="relative">
        <Image
          src={movie.poster?.url}
          height={350}
          alt={movie.name || movie.alternativeName}
          fallbackSrc="https://images.unsplash.com/photo-1489599735734-79b4169c2a78?w=400&h=600&fit=crop"
          style={{
            transition: "transform 0.3s ease",
          }}
        />
        
        {/* Градиент оверлей */}
        <Box
          pos="absolute"
          bottom={0}
          left={0}
          right={0}
          h="60%"
          style={{
            background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
            pointerEvents: "none",
          }}
        />
        
        {/* Кнопка избранного */}
        <Tooltip label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}>
          <ActionIcon
            pos="absolute"
            top={12}
            right={12}
            variant={isFavorite ? "filled" : "white"}
            color={isFavorite ? "red" : "gray"}
            size="lg"
            radius="xl"
            onClick={toggleFavorite}
            style={{
              backdropFilter: isFavorite ? "none" : "blur(10px)",
              backgroundColor: isFavorite ? undefined : "rgba(255, 255, 255, 0.9)",
            }}
          >
            {isFavorite ? <FaHeart size={16} /> : <CiHeart size={18} />}
          </ActionIcon>
        </Tooltip>

        {/* Контент поверх изображения */}
        <Box pos="absolute" bottom={0} left={0} right={0} p="md">
          <Stack gap="xs">
            <Text 
              fw={600} 
              size="lg" 
              c="white" 
              lineClamp={2}
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
            >
              {movie.name || movie.alternativeName}
            </Text>
            
            <Flex justify="space-between" align="center">
              <Badge 
                variant="light" 
                color="blue" 
                size="sm"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
              >
                {movie.year}
              </Badge>
              
              <Flex align="center" gap={4}>
                <Rating value={movie.rating.kp / 2} fractions={2} readOnly size="sm" />
                <Text size="sm" c="white" fw={500}>
                  {movie.rating.kp.toFixed(1)}
                </Text>
              </Flex>
            </Flex>
            
            <Group gap={4}>
              {movie.genres.slice(0, 3).map((genre) => (
                <Badge 
                  key={genre.name} 
                  variant="light" 
                  size="xs"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                >
                  {genre.name}
                </Badge>
              ))}
              {movie.genres.length > 3 && (
                <Badge variant="light" size="xs" color="gray">
                  +{movie.genres.length - 3}
                </Badge>
              )}
            </Group>
          </Stack>
        </Box>
      </Box>
    </Card>
  );
}

export default MovieCard;