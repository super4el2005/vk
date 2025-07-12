import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useMemo } from 'react';
import { Box, Center, Loader, Text } from '@mantine/core';
import MovieCard from './MovieCard';
import type { Movie } from '../utils';

interface VirtualizedMovieGridProps {
  movies: Movie[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
}

export default function VirtualizedMovieGrid({
  movies,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
}: VirtualizedMovieGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Определяем количество колонок в зависимости от ширины экрана
  const getColumnsCount = () => {
    if (typeof window === 'undefined') return 4;
    const width = window.innerWidth;
    if (width < 576) return 1; // xs
    if (width < 768) return 2; // sm
    if (width < 992) return 3; // md
    return 4; // lg и выше
  };

  const columnsCount = getColumnsCount();
  
  // Группируем фильмы по строкам
  const rows = useMemo(() => {
    const result: Movie[][] = [];
    for (let i = 0; i < movies.length; i += columnsCount) {
      result.push(movies.slice(i, i + columnsCount));
    }
    return result;
  }, [movies, columnsCount]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 450, // Примерная высота строки с карточками
    overscan: 2, // Количество дополнительных элементов для рендера
  });

  // Загружаем больше данных когда приближаемся к концу
  const lastItem = virtualizer.getVirtualItems().at(-1);
  if (
    lastItem &&
    lastItem.index >= rows.length - 3 &&
    hasNextPage &&
    !isFetchingNextPage
  ) {
    onLoadMore();
  }

  if (isLoading) {
    return (
      <Center h={400}>
        <Loader size="xl" />
      </Center>
    );
  }

  if (movies.length === 0) {
    return (
      <Center h={400}>
        <Text size="lg" c="dimmed">
          Фильмы не найдены
        </Text>
      </Center>
    );
  }

  return (
    <Box
      ref={parentRef}
      style={{
        height: '80vh',
        overflow: 'auto',
        scrollBehavior: 'smooth',
      }}
    >
      <Box
        style={{
          height: virtualizer.getTotalSize(),
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index];
          if (!row) return null;

          return (
            <Box
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: virtualRow.size,
                transform: `translateY(${virtualRow.start}px)`,
                display: 'grid',
                gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
                gap: '24px',
                padding: '12px 0',
              }}
            >
              {row.map((movie) => (
                <MovieCard key={movie.id} {...movie} />
              ))}
            </Box>
          );
        })}
      </Box>

      {isFetchingNextPage && (
        <Center py="xl">
          <Loader />
        </Center>
      )}

      {!hasNextPage && movies.length > 0 && (
        <Center py="xl">
          <Text c="dimmed">Все фильмы загружены</Text>
        </Center>
      )}
    </Box>
  );
}