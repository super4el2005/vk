import {
  Card,
  Image,
  Group,
  Text,
  Flex,
  Badge,
  Tooltip,
  ActionIcon,
} from "@mantine/core";
import type { Movie } from "../utils";
import { CiHeart } from "react-icons/ci";
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
      padding="lg"
      radius="md"
      withBorder
      component={NavLink}
      to={`/${movie.id}`}
    >
      <Card.Section>
        <Image
          src={movie.poster?.url}
          height={250}
          alt={movie.name || movie.alternativeName}
        />
      </Card.Section>

      <Group justify="space-between" mb="xs">
        <Text fw={500}>{movie.name || movie.alternativeName}</Text>
        <Flex gap={10}>
          <Badge color="pink">{movie.year}</Badge>
          <Badge color="yellow">{movie.rating.kp}</Badge>
        </Flex>
      </Group>
      <Group mb="xs">
        {movie.genres.map((genre) => (
          <Badge key={genre.name} color="pink">{genre.name}</Badge>
        ))}
      </Group>
      <Tooltip label={isFavorite ? "Не нравится" : "Нравится"}>
        <ActionIcon
          variant={isFavorite ? "light" : "outline"}
          aria-label={isFavorite ? "Не нравится" : "Нравится"}
          color={isFavorite ? "red" : ""}
          size={"lg"}
          radius={"lg"}
          onClick={toggleFavorite}
        >
          <CiHeart size={24} />
        </ActionIcon>
      </Tooltip>
    </Card>
  );
}

export default MovieCard;
