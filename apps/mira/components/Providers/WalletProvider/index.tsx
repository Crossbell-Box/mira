import { WagmiConfig } from "wagmi";
import { ConnectKitProvider } from "connectkit";
import { useMantineColorScheme } from "@mantine/core";
import { client } from "./client";

export default function WalletProvider({ children }: React.PropsWithChildren) {
	const { colorScheme } = useMantineColorScheme();

	return (
		<WagmiConfig client={client}>
			<ConnectKitProvider mode={colorScheme}>{children}</ConnectKitProvider>
		</WagmiConfig>
	);
}
