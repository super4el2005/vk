import {
  Container,
  Flex,
  MultiSelect,
  Paper,
  RangeSlider,
  SimpleGrid,
  Text,
  Tooltip,
  ActionIcon,
  Skeleton,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useQuery } from "@tanstack/react-query";
import { NavLink, useSearchParams } from "react-router";
import { api } from "../main";
import { CiHeart } from "react-icons/ci";
import { useDebouncedCallback } from "@mantine/hooks";
import type { Genre, Movie } from "../types";
import MovieCard from "../components/MovieCard";

function Filter() {
  const genres = useQuery({
    queryKey: ["genres"],
    queryFn: () =>
      api.get<Genre[]>("/v1/movie/possible-values-by-field", {
        params: {
          field: "genres.name",
        },
      }),
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const debounceSearchParams = useDebouncedCallback(setSearchParams, 500);

  const filterForm = useForm({
    mode: "controlled",
    initialValues: searchParams,
    onValuesChange: (values) => debounceSearchParams(values),
  });

  return (
    <form>
      <MultiSelect
        disabled={genres.isLoading}
        label="Жанры"
        placeholder="Выберите жанры"
        data={genres.data?.data.map((genre) => ({
          value: genre.slug,
          label: genre.name,
        }))}
        {...filterForm.getInputProps("genres")}
        searchable
      />
      <Text fw={700} size="sm" mt={30} mb={15}>
        Рейтинг
      </Text>
      <RangeSlider
        min={1}
        max={10}
        step={0.1}
        minRange={0}
        marks={[
          { value: 1, label: "1" },
          { value: 10, label: "10" },
        ]}
        {...filterForm.getInputProps("rating")}
      />
      <Text fw={700} size="sm" mt={30} mb={15}>
        Года
      </Text>
      <RangeSlider
        min={1990}
        max={new Date().getFullYear()}
        minRange={0}
        marks={[
          { value: 1990, label: "1990" },
          {
            value: new Date().getFullYear(),
            label: String(new Date().getFullYear()),
          },
        ]}
        {...filterForm.getInputProps("yearRange")}
      />
    </form>
  );
}

export default function Page() {
  const [searchParams] = useSearchParams();

  const movies = useQuery({
    queryKey: ["movies", searchParams.toString()],
    queryFn: () =>
      api.get<{ docs: Movie[] }>("/v1.4/movie", {
        params: {
          ...searchParams,
          limit: 50,
          notNullFields: [
            "name",
            "rating.kp",
            "poster.url",
            "description",
            "genres.name",
            "year",
          ],
        },
      }),
  });

  return (
    <Container size="xl" py={20}>
      <Flex gap={30} direction={{ base: "column", lg: "row" }}>
        <Paper
          shadow="xs"
          p="xl"
          h={"min-content"}
          pos={{ base: "static", lg: "sticky" }}
          top={30}
        >
          <Filter />
        </Paper>
        <Skeleton visible={movies.isLoading}>
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 3 }}
            spacing={{ base: 10, sm: "xl" }}
            verticalSpacing={{ base: "md", sm: "xl" }}
          >
            {movies.data?.data.docs.map((movie) => (
              <MovieCard key={movie.id} {...movie} />
            ))}
          </SimpleGrid>
        </Skeleton>
        <Tooltip label="Избранное">
          <ActionIcon
            component={NavLink}
            to={"/favorites"}
            variant="default"
            aria-label="Избранное"
            size={"lg"}
            radius={"lg"}
            pos={{ base: "static", lg: "sticky" }}
            top={30}
          >
            <CiHeart size={24} />
          </ActionIcon>
        </Tooltip>
      </Flex>
    </Container>
  );
}
