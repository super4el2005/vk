import {
  Container,
  Flex,
  MultiSelect,
  Paper,
  RangeSlider,
  SimpleGrid,
  Text,
  ActionIcon,
  Center,
  Loader,
  Box,
  Title,
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
      shadow="sm"
      p="lg"
      withBorder
      h="min-content"
      pos={{ base: "static", lg: "sticky" }}
      top={20}
      style={{
        backgroundColor: "white",
      }}
    >
      <form>
        <Title order={4} mb="lg">
          Фильтры
        </Title>
        
        <MultiSelect
          disabled={genres.isLoading}
          label="Жанры"
          placeholder="Выберите жанры"
          data={genres.data?.data.map((genre) => genre.name)}
          {...filterForm.getInputProps("genres.name")}
          searchable
          mb="lg"
        />
        
        <Text fw={500} size="sm" mb="sm">
          Рейтинг: {filterForm.values.rating?.kp?.[0]} - {filterForm.values.rating?.kp?.[1]}
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
          mb="lg"
        />
        
        <Text fw={500} size="sm" mb="sm">
          Год: {filterForm.values.year?.[0]} - {filterForm.values.year?.[1]}
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
    </Paper>
  );
}

export default function Page() {
  const [filterValues] = useFilterSearchParams();
  const movies = useInfiniteMovies(filterValues);
  const { ref, entry } = useIntersection({
    threshold: 1,
  });

  const allMovies = movies.data?.pages.flatMap(page => page.data.docs) || [];

  useEffect(() => {
    if (entry?.isIntersecting && movies.hasNextPage && !movies.isFetchingNextPage) {
      movies.fetchNextPage();
    }
  }, [entry?.isIntersecting, movies.hasNextPage, movies.isFetchingNextPage]);

  return (
    <Box
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Container size="xl" py="xl">
        <Flex gap="xl" direction={{ base: "column", lg: "row" }}>
          <Box w={{ base: "100%", lg: 280 }}>
            <Filter />
          </Box>
          
          <Box flex={1}>
            <Title order={2} mb="xl" c="dark">
              Фильмы
            </Title>
            
            {movies.isLoading ? (
              <Center h={400}>
                <Loader size="lg" />
              </Center>
            ) : allMovies.length === 0 ? (
              <Center h={400}>
                <Text size="lg" c="dimmed">
                  Фильмы не найдены
                </Text>
              </Center>
            ) : (
              <>
                <SimpleGrid
                  cols={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
                  spacing="lg"
                  verticalSpacing="lg"
                >
                  {allMovies.map((movie) => (
                    <MovieCard key={movie.id} {...movie} />
                  ))}
                </SimpleGrid>
                
                {movies.hasNextPage && (
                  <Box ref={ref} py="xl">
                    <Center>
                      {movies.isFetchingNextPage && <Loader />}
                    </Center>
                  </Box>
                )}
                
                {!movies.hasNextPage && allMovies.length > 0 && (
                  <Center py="xl">
                    <Text c="dimmed">Все фильмы загружены</Text>
                  </Center>
                )}
              </>
            )}
          </Box>
          
          <Box w={{ base: "100%", lg: "auto" }}>
            <ActionIcon
              component={NavLink}
              to="/favorites"
              variant="filled"
              color="red"
              size="lg"
              pos={{ base: "static", lg: "sticky" }}
              top={20}
              style={{
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <CiHeart size={20} />
            </ActionIcon>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}