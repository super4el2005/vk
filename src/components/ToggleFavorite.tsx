import { useFavoritesMovies } from "../hooks/useFavoritesMovies";
import { modals } from "@mantine/modals";
import { ActionIcon, Text, Tooltip } from "@mantine/core";
import { FaHeart } from "react-icons/fa6";
import { CiHeart } from "react-icons/ci";
import type { Movie } from "../utils";

function ToggleFavorite(movie: Movie) {
  const [favorites, setFavorites] = useFavoritesMovies();
  const isFavorite = Boolean(
    favorites?.find((favorite) => favorite.id === movie.id)
  );

  const openModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    modals.openConfirmModal({
      title: isFavorite ? "Удалить из избранного" : "Добавить в избранное",
      children: (
        <Text size="sm">
          {isFavorite
            ? "Вы точно хотите удалить фильм из избранного?"
            : "Вы точно хотите добавить фильм в избранное?"}
        </Text>
      ),
      labels: { confirm: "Принять", cancel: "Закрыть" },
      onConfirm: () =>
        setFavorites((prev) =>
          isFavorite
            ? prev.filter((favorite) => favorite.id !== movie.id)
            : [...prev, movie]
        ),
    });
  };
  return (
    <Tooltip
      label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
    >
      <ActionIcon
        pos="absolute"
        top={8}
        right={8}
        variant={isFavorite ? "filled" : "white"}
        color={isFavorite ? "red" : "gray"}
        size="md"
        onClick={openModal}
        style={{
          backgroundColor: isFavorite ? undefined : "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {isFavorite ? <FaHeart size={14} /> : <CiHeart size={16} />}
      </ActionIcon>
    </Tooltip>
  );
}

export default ToggleFavorite;
