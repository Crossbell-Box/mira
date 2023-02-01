import { Button, Space, Text } from "@mantine/core";
import { useAtom } from "jotai";
import BigNumberInput from "./BigNumberInput";
import NetworkSelector from "./NetworkSelector";
import {
	formAmountAtom,
	formMainchainNetworkIdAtom,
	formSidechainNetworkIdAtom,
} from "../store";
import { useDepositModal } from "../Modal/DepositModal";
import { useAccount } from "wagmi";
import { useModal } from "connectkit";
import { useWithdrawModal } from "../Modal/WithdrawModal";
import MaxPayCalculator, {
	useIsAmountLargerThanBalance,
} from "./MaxPayCalculator";

export default function Form({
	mode = "deposit",
}: {
	mode?: "deposit" | "withdraw";
}) {
	const [value, setValue] = useAtom(formAmountAtom);
	const [mainchain, setMainchain] = useAtom(formMainchainNetworkIdAtom);
	const [sidechain, setSidechain] = useAtom(formSidechainNetworkIdAtom);

	const { isConnected } = useAccount();
	const { setOpen: setOpenConnect } = useModal();

	const renderMainchainNetworkSelector = () => {
		return (
			<NetworkSelector
				label="From"
				mode="mainchain"
				value={mainchain}
				onChange={(v) => setMainchain(v)}
			/>
		);
	};

	const renderSidechainNetworkSelector = () => {
		return (
			<NetworkSelector
				label="On"
				mode="sidechain"
				value={sidechain}
				onChange={(v) => setSidechain(v)}
			/>
		);
	};

	const { open: openDepositModal } = useDepositModal();
	const { open: openWithdrawModal } = useWithdrawModal();

	const openModal = () => {
		if (!isConnected) {
			setOpenConnect(true);
			return;
		}
		if (mode === "deposit") {
			openDepositModal();
		} else {
			openWithdrawModal();
		}
	};

	const isAmountLargerThanBalance =
		useIsAmountLargerThanBalance() && mode === "withdraw";

	const submitBtnDisabled =
		!value || (isConnected && isAmountLargerThanBalance);

	return (
		<div>
			<BigNumberInput
				mode={mode === "deposit" ? "depositFrom" : "withdrawFrom"}
				value={value}
				onChange={(v) => setValue(v)}
			/>
			<Space h={5} />
			{mode === "withdraw" && <MaxPayCalculator />}
			<Space h={10} />
			{mode === "deposit"
				? renderMainchainNetworkSelector()
				: renderSidechainNetworkSelector()}

			<Space h={20} />

			<BigNumberInput
				mode={mode === "deposit" ? "depositTo" : "withdrawTo"}
				value={value}
				onChange={(v) => setValue(v)}
			/>
			<Space h={10} />
			{mode === "deposit"
				? renderSidechainNetworkSelector()
				: renderMainchainNetworkSelector()}

			<Space h={20} />

			<Text color="dimmed" size="xs">
				{mode === "deposit" ? "1 USDC = 1 MIRA" : "1 MIRA = 1 USDC"}
			</Text>

			<Space h={20} />

			<Button
				fullWidth
				size="lg"
				onClick={openModal}
				disabled={submitBtnDisabled}
			>
				{mode === "deposit" ? "Buy $MIRA" : "Sell $MIRA"}
			</Button>
		</div>
	);
}
