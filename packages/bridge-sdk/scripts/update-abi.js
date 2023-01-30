#!/usr/bin/env node

const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);
const { writeFile, mkdir, readFile } = require("fs/promises");
const { existsSync } = require("fs");
const { resolve } = require("path");

// https://github.com/Crossbell-Box/crossbell-bridge-contracts/tree/main/build-info

const getAbi = (name) =>
	fetch(
		`https://raw.githubusercontent.com/Crossbell-Box/crossbell-bridge-contracts/main/build-info/${name}.abi`
	)
		.then((res) => res.json())
		.catch((e) => {
			console.error(`Error while fetching ${name}`);
			throw e;
		});

const getAddress = () =>
	fetch(
		`https://raw.githubusercontent.com/Crossbell-Box/crossbell-bridge-contracts/main/deployments/address.json`
	)
		.then((res) => res.json())
		.catch((e) => {
			console.error(`Error while fetching address`);
			throw e;
		});

const writeJson = async (dir, abi) => {
	if (!existsSync(dir)) {
		await mkdir(dir);
	}
	await writeFile(`${dir}/abi.json`, JSON.stringify(abi, null, 2));
};

const genTypes = (dir) =>
	execAsync(
		`${require.resolve(
			".bin/typechain"
		)} --target ethers-v5 --out-dir ${dir}/types ${dir}/abi.json`
	);

const main = async () => {
	// abi

	const abis = ["CrossbellGateway", "MainchainGateway", "Validator"];

	const dir = resolve(__dirname, "../src/abi");

	for (const abi of abis) {
		const json = await getAbi(abi);
		const abiDir = `${dir}/${abi}`;
		await writeJson(abiDir, json);
		await genTypes(abiDir);
		console.log(`Generated types for ${abi}`);
	}

	// address

	const addressJSON = await getAddress().then((res) =>
		JSON.stringify(res, null, 2)
	);
	const addressFile = resolve(__dirname, "../src/contract/address.ts");
	let content = await readFile(addressFile, "utf-8");
	// match multiple lines
	content = content.replace(
		/export const CONTRACT_ADDRESS = .+? satisfies/s,
		`export const CONTRACT_ADDRESS = ${addressJSON} satisfies`
	);
	content = require("prettier").format(content, { parser: "typescript" });
	await writeFile(addressFile, content);
	console.log("Generated address");

	console.log("done");
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
