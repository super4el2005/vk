import { useParams } from "react-router";
import { api } from "../main";
import type { Movie } from "../types";
import { Grid, Image, Skeleton, Stack, Flex } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const params = useParams();
  const movie = useQuery({
    queryKey: ["movie", params.id],
    queryFn: () => api.get<Movie>(`/v1.4/movie/${params.id}`),
  });

  return (
    <>
      {movie.isLoading && (
        <Grid gutter="xl">
          <Grid.Col>
            <Skeleton height={400} />
          </Grid.Col>
          <Grid.Col>
            <Stack gap="sm">
              <Skeleton height={40} width="70%" />
              <Skeleton height={20} width="50%" />
              <Skeleton height={16} width="30%" mt="md" />
              <Skeleton height={16} width="80%" mt="xl" />
              <Skeleton height={16} width="100%" />
              <Skeleton height={16} width="60%" />
            </Stack>
          </Grid.Col>
        </Grid>
      )}
      {movie.isSuccess && (
        <Flex>
          <Image
            radius="md"
            src={movie.data.data.poster?.url}
            fit="none" // или "contain", если нужно сохранить пропорции
            fallbackSrc="https://placehold.co/600x400?text=Постер не найден"
          />
        </Flex>
      )}
    </>
  );
}
