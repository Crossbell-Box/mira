import { ActionIcon, Affix, Tooltip } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconBrandDiscord } from "@tabler/icons-react";

export default function ContactButton() {
  const isLargerThanSm = useMediaQuery("(min-width: 640px)", false, {
    getInitialValueInEffect: true,
  });

  return (
    <Affix position={{ bottom: isLargerThanSm ? 20 : 60, right: 20 }}>
      <Tooltip position="left" label="Join us on Discord">
        <ActionIcon
          variant="filled"
          size="xl"
          radius="xl"
          color="blue"
          component="a"
          href="https://discord.gg/4GCwDsruyj"
          target="_blank"
        >
          <IconBrandDiscord size={32} />
        </ActionIcon>
      </Tooltip>
    </Affix>
  );
}
