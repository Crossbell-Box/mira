import { ethers } from "ethers";
import { CrossbellGatewayAbiFactory, MainchainGatewayAbiFactory } from "..";
import {
	Abi as CrossbellGatewayAbi,
	RequestWithdrawalEvent,
} from "../abi/CrossbellGateway/types/Abi";
import {Abi as MainchainGateway, RequestDepositEvent} from "../abi/MainchainGateway/types/Abi";

const logTopics = {
	RequestWithdrawal:
		"RequestWithdrawal(uint256,uint256,address,address,uint256,uint256)",
	RequestDeposit:
		"RequestDeposit(uint256,uint256,address,address,uint256,bytes32)",
} as const satisfies Record<
	// keys
	string,
	// values
	keyof CrossbellGatewayAbi["filters"] | keyof MainchainGateway["filters"]
>;

type LogEvents = {
	"RequestWithdrawal(uint256,uint256,address,address,uint256,uint256)": RequestWithdrawalEvent;
	"RequestDeposit(uint256,uint256,address,address,uint256,bytes32)": RequestDepositEvent;
};

export function parseLog<TopicName extends keyof typeof logTopics>(
	logs: ethers.providers.Log[],
	filterTopic: TopicName
): LogEvents[(typeof logTopics)[TopicName]] {
	const targetTopicHash = ethers.utils.keccak256(
		ethers.utils.toUtf8Bytes(logTopics[filterTopic])
	);

	const _logs = logs.filter((log) => log.topics[0] === targetTopicHash);

	if (_logs.length === 0) {
		throw new Error(`Log with topic ${filterTopic} not found`);
	}

	if (_logs.length > 1) {
		throw new Error(`More than one log with topic ${filterTopic} found`);
	}

	const log = _logs[0];

	const iface = new ethers.utils.Interface([
		...CrossbellGatewayAbiFactory.abi,
		...MainchainGatewayAbiFactory.abi,
	]);

	return iface.parseLog(
		log
	) as unknown as LogEvents[(typeof logTopics)[TopicName]];
}
