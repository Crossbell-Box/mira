import { SegmentedControl, SegmentedControlProps, Space } from "@mantine/core";
import { Input, Text } from "@mantine/core";
import {
	crossbellChain,
	mainChains,
} from "../../Providers/WalletProvider/chains";

export default function NetworkSelector({
	label,
	mode = "mainchain",
	value,
	onChange,
	...props
}: Omit<SegmentedControlProps, "data" | "label" | "value" | "onChange"> & {
	label?: string;
	mode?: "mainchain" | "sidechain";
	value?: number;
	onChange?: (value: number) => void;
}) {
	const chains = mode === "mainchain" ? mainChains : [crossbellChain];

	return (
		<div>
			{label && (
				<>
					<div>
						<Input.Label>
							<Text color="dimmed">{label}</Text>
						</Input.Label>
					</div>

					<Space h={5} />
				</>
			)}

			<SegmentedControl
				classNames={{ root: "w-full overflow-auto" }}
				styles={{ root: { width: "100%" } }}
				{...props}
				data={chains.map((chain) => ({
					label: chain.name,
					value: chain.id.toString(),
				}))}
				value={value?.toString()}
				onChange={(v) => onChange?.(parseInt(v))}
			/>
		</div>
	);
}
