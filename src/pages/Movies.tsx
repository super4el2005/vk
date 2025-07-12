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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router";
import { api } from "../main";
import { CiHeart } from "react-icons/ci";
import { useDebouncedCallback } from "@mantine/hooks";
import {
  CURRENT_YEAR,
  FILTER_SCHEMA,
  paramsSerializer,
  type FilterValues,
  type Genre,
  type Movie,
} from "../utils";
import MovieCard from "../components/MovieCard";
import { zodResolver } from "mantine-form-zod-resolver";
import { useFilterSearchParams } from "../hooks/useFilterSearchParams";
import superjson from "superjson";

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

  const [filterValues, setFilterParams] = useFilterSearchParams();
  const debounceSearchParams = useDebouncedCallback(setFilterParams, 500);

  const filterForm = useForm<FilterValues>({
    mode: "controlled",
    initialValues: filterValues || {
      rating: {
        kp: [1, 10],
      },
      genres: {
        name: [],
      },
      year: [1990, CURRENT_YEAR],
    },
    validate: zodResolver(FILTER_SCHEMA),
    onValuesChange: (values) => debounceSearchParams(values),
  });
  return (
    <form>
      <MultiSelect
        disabled={genres.isLoading}
        label="Жанры"
        placeholder="Выберите жанры"
        data={genres.data?.data.map((genre) => genre.name)}
        {...filterForm.getInputProps("genres.name")}
        searchable
      />
      <Text fw={700} size="sm" mt={30} mb={15}>
        Рейтинг
      </Text>
      <RangeSlider
        defaultValue={[1, 10]}
        min={1}
        max={10}
        step={0.1}
        minRange={0}
        marks={[
          { value: 1, label: "1" },
          { value: 10, label: "10" },
        ]}
        {...filterForm.getInputProps("rating.kp")}
      />
      <Text fw={700} size="sm" mt={30} mb={15}>
        Года
      </Text>
      <RangeSlider
        defaultValue={[1990, CURRENT_YEAR]}
        min={1990}
        max={CURRENT_YEAR}
        minRange={0}
        marks={[
          { value: 1990, label: "1990" },
          {
            value: CURRENT_YEAR,
            label: String(CURRENT_YEAR),
          },
        ]}
        {...filterForm.getInputProps("year")}
      />
    </form>
  );
}

export default function Page() {
  const [filterValues] = useFilterSearchParams();
  const movies = useQuery({
    queryKey: ["movies", superjson.stringify(filterValues)],
    queryFn: () =>
      api.get<{ docs: Movie[] }>("/v1.4/movie", {
        params: {
          ...filterValues,
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
        paramsSerializer,
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
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
        >
          {movies.data?.data.docs.map((movie) => (
            <MovieCard key={movie.id} {...movie} />
          ))}
        </SimpleGrid>
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
