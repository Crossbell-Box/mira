import { Button, Divider, Space } from "@mantine/core";
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
  useIsAmountLargerThanZero,
} from "./MaxPayCalculator";
import { IconArrowDown } from "@tabler/icons-react";

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
        mode="mainchain"
        value={mainchain}
        onChange={(v) => setMainchain(v)}
      />
    );
  };

  const renderSidechainNetworkSelector = () => {
    return (
      <NetworkSelector
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

  const isAmountLargerThanZero = useIsAmountLargerThanZero();
  const submitBtnDisabled =
    !value ||
    (isConnected && isAmountLargerThanBalance) ||
    !isAmountLargerThanZero;

  return (
    <div>
      {/* from */}

      <Space h={10} />
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

      {/* to icon */}

      <div>
        <Space h={20} />
        <Divider label={<IconArrowDown />} labelPosition="center"></Divider>
        <Space h={20} />
      </div>

      {/* to */}

      {/* <BigNumberInput
				mode={mode === "deposit" ? "depositTo" : "withdrawTo"}
				value={value}
				onChange={(v) => setValue(v)}
			/>
			<Space h={10} /> */}
      {mode === "deposit"
        ? renderSidechainNetworkSelector()
        : renderMainchainNetworkSelector()}
      <Space h={20} />

      {/* submit */}

      <Button
        fullWidth
        size="lg"
        onClick={openModal}
        disabled={submitBtnDisabled}
      >
        {mode === "deposit" ? "Swap $MIRA" : "Swap $MIRA"}
      </Button>
    </div>
  );
}
