import { Group, Header as Header_, Text } from "@mantine/core";
import ConnectButton from "@/components/ConnectButton";
import ColorSchemeSwitch from "./ColorSchemeSwitch";
import { MiraLogo } from "@/components/Logo";

export default function Header() {
	return (
		<Header_ height={60} p="xs">
			<Group position="apart">
				<Group spacing="xs" className="w-fit sm:w-[120px]">
					<MiraLogo height={40} width={40} />
					<Text size="xl" fw="bold" className="select-none hidden sm:inline">
						MIRA
					</Text>
				</Group>

				<ConnectButton />

				<Group position="right" className="w-fit sm:w-[120px]">
					<ColorSchemeSwitch />
				</Group>
			</Group>
		</Header_>
	);
}
