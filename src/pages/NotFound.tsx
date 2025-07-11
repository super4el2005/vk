import { Button, Center, Stack, Title } from "@mantine/core";
import { NavLink } from "react-router";

export default function Page() {
  return (
    <Center h={"100vh"} bg="var(--mantine-color-gray-light)">
      <Stack>
        <Title>Страница не найдена</Title>
        <Button component={NavLink} to={"/"} variant="default">
          Главная
        </Button>
      </Stack>
    </Center>
  );
}
