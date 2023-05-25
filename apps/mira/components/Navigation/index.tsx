import { Box, NavLink, Space } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect } from "react";
import { useRoutes } from "./routes";

function HeaderNavigation() {
  const { routes, currentRoutePath } = useRoutes();

  const isLargerThanMd = useMediaQuery("(min-width: 768px)", false, {
    getInitialValueInEffect: true,
  });

  return (
    <nav className="flex items-center space-x-5">
      {routes.map((route) => (
        <NavLink
          key={route.path}
          classNames={{
            root: "w-fit",
            label: "text-lg font-semibold uppercase",
          }}
          component="a"
          href={route.path}
          label={route.name}
          icon={isLargerThanMd ? route.icon : null}
          active={currentRoutePath === route.path}
        />
      ))}
    </nav>
  );
}

function BottomNavigation() {
  const { routes, currentRoutePath } = useRoutes();

  const isLargerThanSm = useMediaQuery("(min-width: 640px)", false, {
    getInitialValueInEffect: true,
  });

  useEffect(() => {
    // add padding to the bottom of the page to make space for navigation
    document.body.style.paddingBottom = isLargerThanSm ? "0" : "3.5rem";

    return () => {
      document.body.style.paddingBottom = "0";
    };
  }, [isLargerThanSm]);

  return (
    <Box
      className="fixed bottom-0 left-0 w-full"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[7]
            : theme.colors.gray[0],
      })}
    >
      <nav className="flex items-center justify-center w-full">
        {routes.map((route) => (
          <NavLink
            key={route.path}
            classNames={{
              label:
                "text-lg font-semibold uppercase flex items-center justify-center",
            }}
            component="a"
            href={route.path}
            label={
              <>
                {route.icon}
                <Space w="xs" /> {route.name}
              </>
            }
            active={currentRoutePath === route.path}
          />
        ))}
      </nav>
    </Box>
  );
}

export default function Navigation({
  mode,
}: {
  mode: "onHeader" | "onBottom" | "auto";
}) {
  if (mode === "auto") {
    return (
      <>
        <div className="block sm:hidden">
          <BottomNavigation />
        </div>

        <div className="hidden sm:block">
          <HeaderNavigation />
        </div>
      </>
    );
  }

  if (mode === "onHeader") {
    return <HeaderNavigation />;
  }

  if (mode === "onBottom") {
    return <BottomNavigation />;
  }

  return <></>;
}
