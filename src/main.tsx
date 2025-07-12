import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import "@mantine/core/styles.css";

import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from '@mantine/modals';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

import Movies from "./pages/Movies";
import Movie from "./pages/Movie";
import Favorites from "./pages/Favorites";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
      retry: false,
    },
  },
});

export const api = axios.create({
  baseURL: "https://api.kinopoisk.dev/",
  headers: {
    "X-API-KEY": "X7QT4YK-0R0M5D8-MV0QT0T-23TBSSN",
  },
  paramsSerializer: {
    indexes: null,
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <MantineProvider>
        <ModalsProvider>
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
          </ModalsProvider>
      </MantineProvider>
    ),
    children: [
      {
        index: true,
        Component: Movies,
      },
      {
        Component: Layout,
        children: [
          {
            path: ":id",
            Component: Movie,
          },
          {
            path: "favorites",
            Component: Favorites,
          },
        ],
      },
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
]);

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(<RouterProvider router={router} />);
