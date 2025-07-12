import { Button, Container, Box } from "@mantine/core";
import { FaChevronLeft } from "react-icons/fa6";
import { NavLink, Outlet } from "react-router";

export default function Layout() {
  return (
    <Box
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Container size="xl" py="md">
        <Button
          leftSection={<FaChevronLeft />}
          mb={20}
          component={NavLink}
          to="/"
          variant="white"
          radius="xl"
          size="md"
          style={{
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          Главная
        </Button>
        <Outlet />
      </Container>
    </Box>
  );
}