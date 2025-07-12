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
  Center,
  Loader,
  Button,
  Box,
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
  type FilterValues,
  type Genre,
} from "../utils";
import MovieCard from "../components/MovieCard";
import { zodResolver } from "mantine-form-zod-resolver";
import { useFilterSearchParams } from "../hooks/useFilterSearchParams";
import { useInfiniteMovies } from "../hooks/useInfiniteMovies";
import { useEffect } from "react";
import { useIntersection } from "@mantine/hooks";
import VirtualizedMovieGrid from "../components/VirtualizedMovieGrid";

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
    <Paper
      shadow="lg"
      p="xl"
      radius="xl"
      h="min-content"
      pos={{ base: "static", lg: "sticky" }}
      top={30}
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
      }}
    >
      <form>
        <Text fw={700} size="lg" mb="lg" ta="center">
          Фильтры
        </Text>
        
        <MultiSelect
          disabled={genres.isLoading}
          label="Жанры"
          placeholder="Выберите жанры"
          data={genres.data?.data.map((genre) => genre.name)}
          {...filterForm.getInputProps("genres.name")}
          searchable
          styles={{
            input: {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "white",
            },
            label: {
              color: "white",
              fontWeight: 600,
            },
          }}
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
          styles={{
            track: { backgroundColor: "rgba(255, 255, 255, 0.3)" },
            bar: { backgroundColor: "white" },
            thumb: { backgroundColor: "white", borderColor: "white" },
            markLabel: { color: "white" },
          }}
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
          styles={{
            track: { backgroundColor: "rgba(255, 255, 255, 0.3)" },
            bar: { backgroundColor: "white" },
            thumb: { backgroundColor: "white", borderColor: "white" },
            markLabel: { color: "white" },
          }}
        />
      </form>
    </Paper>
  );
}

export default function Page() {
  const [filterValues] = useFilterSearchParams();
  const movies = useInfiniteMovies(filterValues);

  const allMovies = movies.data?.pages.flatMap(page => page.data.docs) || [];

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <Container size="xl" py={30}>
        <Flex gap={30} direction={{ base: "column", lg: "row" }}>
          <Box w={{ base: "100%", lg: 300 }}>
            <Filter />
          </Box>
          
          <Box flex={1}>
            <VirtualizedMovieGrid
              movies={allMovies}
              isLoading={movies.isLoading}
              isFetchingNextPage={movies.isFetchingNextPage}
              hasNextPage={movies.hasNextPage}
              onLoadMore={() => movies.fetchNextPage()}
            />
          </Box>
          
          <Box w={{ base: "100%", lg: "auto" }}>
            <Tooltip label="Избранное">
              <ActionIcon
                component={NavLink}
                to="/favorites"
                variant="gradient"
                gradient={{ from: "pink", to: "red" }}
                size="xl"
                radius="xl"
                pos={{ base: "static", lg: "sticky" }}
                top={30}
                style={{
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
              >
                <CiHeart size={24} />
              </ActionIcon>
            </Tooltip>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}