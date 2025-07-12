import { Button, Container, Box } from "@mantine/core";
import { FaChevronLeft } from "react-icons/fa6";
import { NavLink, Outlet } from "react-router";

export default function Layout() {
  return (
    <Box
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Container size="xl" py="md">
        <Button
          leftSection={<FaChevronLeft />}
          mb={20}
          component={NavLink}
          to="/"
          variant="outline"
          size="md"
        >
          Главная
        </Button>
        <Outlet />
      </Container>
    </Box>
  );
}