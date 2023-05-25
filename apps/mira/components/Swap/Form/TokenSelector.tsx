import { MiraLogo } from "@/components/Logo";
import { Box, Group, Select, Text } from "@mantine/core";
import { forwardRef, ReactElement, useState } from "react";

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  label: string;
  value: string;
  icon: ReactElement;
}

const depositFromTokens: ItemProps[] = [
  // { label: "USDC", value: "USDC", icon: <UsdcLogo height={20} width={20} /> },
  { label: "MIRA", value: "MIRA", icon: <MiraLogo height={20} width={20} /> },
];

const depositToTokens: ItemProps[] = [
  { label: "MIRA", value: "MIRA", icon: <MiraLogo height={20} width={20} /> },
];

const withdrawFromTokens: ItemProps[] = depositToTokens;

const withdrawToTokens: ItemProps[] = depositFromTokens;

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, icon, ...props }: ItemProps, ref) => (
    <div ref={ref} {...props}>
      <Group noWrap spacing="xs">
        {icon}
        <Text size="sm">{label}</Text>
      </Group>
    </div>
  )
);
SelectItem.displayName = "SelectItem";

export type TokenSelectorProps = {
  mode: "depositFrom" | "depositTo" | "withdrawFrom" | "withdrawTo";
};

export default function TokenSelector({ mode }: TokenSelectorProps) {
  let data;
  switch (mode) {
    case "depositFrom":
      data = depositFromTokens;
      break;
    case "depositTo":
      data = depositToTokens;
      break;
    case "withdrawFrom":
      data = withdrawFromTokens;
      break;
    case "withdrawTo":
      data = withdrawToTokens;
      break;
  }

  const [selected, setSelected] = useState(data[0].value);

  return (
    <Select
      classNames={{ root: "px-2" }}
      data={data}
      value={selected}
      onChange={(e) => setSelected(e ?? selected)}
      icon={data.find((item) => item.value === selected)?.icon}
      itemComponent={SelectItem}
      // transition="pop-top-left"
      // transitionDuration={80}
      // transitionTimingFunction="ease"
      readOnly
    />
  );
}
