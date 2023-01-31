import {
	crossbellChain,
	mainChains,
} from "@/components/Providers/WalletProvider/chains";
import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

export const formAmountAtom = atomWithReset("");
export const formMainchainNetworkIdAtom = atom<number>(mainChains[0].id);
export const formSidechainNetworkIdAtom = atom<number>(crossbellChain.id);
