import { networkIdToNameMapping } from "./network";
import { ContractName, TokenName } from "./type";

// https://github.com/Crossbell-Box/crossbell-bridge-contracts/blob/main/deployments/address.json#L4
export const CONTRACT_ADDRESS = {
	MainchainGateway: {
		mainnet: {
			address: "",
		},
		polygon: {
			address: "",
		},
		bsc: {
			address: "",
		},
		goerli: {
			address: "0x86209ccEBe4A7aF99c39c4C2dC806a2983Ef4BaC",
		},
		polygonMumbai: {
			address: "0xe0Bd0128e1a1F947a8963889451eDe875e357A3a",
		},
		bscTestnet: {
			address: "0x26E8166b41d1c0E89F2a6d97Be8eB8f8c7337384",
		},
	},
	CrossbellGateway: {
		crossbell: {
			address: "",
		},
		sepolia: {
			address: "0x3C247725af72732Cd85267F2ff62C9092201eAAD",
		},
	},
	MIRA: {
		mainnet: {
			address: "",
		},
		polygon: {
			address: "",
		},
		bsc: {
			address: "",
		},
		goerli: {
			address: "0xC4026Bc7c9b5988574b07280d9816BC4591B4C62",
			decimals: 6,
		},
		polygonMumbai: {
			address: "0xC9Ec9d8b6C570cf7D594c6E1F407285bC57BF5b2",
			decimals: 18,
		},
		bscTestnet: {
			address: "0xB865a7c5E88B052540213E77b43a76dDCEB1893b",
			decimals: 18,
		},
		crossbell: {
			address: "",
			decimals: 18,
		},
		sepolia: {
			address: "0x3766A79e7CF7D3eaC60845D747d5fB748709bd2e",
			decimals: 18,
		},
	},
	Validator: {
		mainnet: {
			address: "",
		},
		polygon: {
			address: "",
		},
		bsc: {
			address: "",
		},
		crossbell: {
			address: "",
		},
		goerli: {
			address: "0x73bE5E9f82f45564565Ffb53F52b23eAB32032F9",
		},
		polygonMumbai: {
			address: "0xB305E9a96D0b6e2743eD488b5fE7A34750d3D2C8",
		},
		bscTestnet: {
			address: "0x52A0C181D7f43EEF642e47DD45e97ca9777E1C95",
		},
		sepolia: {
			address: "0xbf58a5d64F451f537ABdB8B0203eF3F105097285",
		},
	},
} satisfies Record<ContractName | TokenName, any>;

export function getContractAddress(
	networkId: number,
	contractName: ContractName | TokenName
): `0x${string}` {
	const networkName = networkIdToNameMapping[networkId];
	if (!networkName) {
		throw new Error(`Unknown network id: ${networkId}`);
	}

	const contract = CONTRACT_ADDRESS[contractName];

	if (!contract) {
		throw new Error(`Unknown contract name: ${contractName}`);
	}

	if (networkName in contract) {
		// @ts-ignore
		return contract[networkName]?.address;
	} else {
		throw new Error(
			`Contract ${contractName} is not deployed on network ${networkName}`
		);
	}
}
