import { WagmiConfig } from "wagmi";
import { ConnectKitProvider } from "connectkit";
import { useMantineColorScheme } from "@mantine/core";
import { client } from "./client";

export default function WalletProvider({ children }: React.PropsWithChildren) {
	const { colorScheme } = useMantineColorScheme();

	return (
		<WagmiConfig client={client}>
			<ConnectKitProvider
				mode={colorScheme}
				options={{
					initialChainId: 0, // https://github.com/family/connectkit/issues/16#issuecomment-1401952961
				}}
			>
				{children}
			</ConnectKitProvider>
		</WagmiConfig>
	);
}
