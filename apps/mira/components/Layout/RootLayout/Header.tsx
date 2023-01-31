import { Group, Header as Header_, Text } from "@mantine/core";
import ConnectButton from "@/components/ConnectButton";
import ColorSchemeSwitch from "./ColorSchemeSwitch";
import { MiraLogo } from "@/components/Logo";
import Link from "next/link";
import Navigation from "@/components/Navigation";

function Logo() {
	return (
		<Link href="/" className="no-underline">
			<Group spacing="xs">
				<MiraLogo height={40} width={40} />
				<Text
					size="xl"
					fw="bold"
					className="select-none hidden sm:inline"
					sx={(theme) => ({
						color: theme.colorScheme === "dark" ? "white" : "black",
					})}
				>
					MIRA
				</Text>
			</Group>
		</Link>
	);
}

export default function Header() {
	return (
		<Header_ height={60} p="xs">
			<Group position="apart">
				<Group>
					<Logo />

					<Navigation mode="auto" />
				</Group>

				<Group>
					<ColorSchemeSwitch />
					<ConnectButton />
				</Group>
			</Group>
		</Header_>
	);
}
