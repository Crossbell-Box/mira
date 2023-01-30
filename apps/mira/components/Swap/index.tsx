import { Box, Tabs } from "@mantine/core";
import Form from "./Form";

export default function Swap() {
	return (
		<Box
			className="mx-auto max-w-[500px] p-5"
			sx={(theme) => ({
				backgroundColor:
					theme.colorScheme === "dark"
						? theme.colors.dark[7]
						: theme.colors.gray[2],
			})}
		>
			<Tabs
				defaultValue="deposit"
				classNames={{
					tabsList: "flex justify-between",
					tab: "w-[50%] text-center transition-all duration-50 ease-in-out",
					tabLabel: "text-2xl uppercase transition-all duration-50 ease-in-out",
				}}
			>
				<Tabs.List>
					<Tabs.Tab value="deposit">Deposit</Tabs.Tab>
					<Tabs.Tab value="withdraw">Withdraw</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="deposit" pt="xs">
					<Form mode="deposit" />
				</Tabs.Panel>

				<Tabs.Panel value="withdraw" pt="xs">
					<Form mode="withdraw" />
				</Tabs.Panel>
			</Tabs>
		</Box>
	);
}
