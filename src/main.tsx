import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import "@mantine/core/styles.css";

import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
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
    "X-API-KEY": "PW0EZG4-KT2MRWC-MCVHTV4-A22X0XH",
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
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
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
