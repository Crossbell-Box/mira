import { ethers } from "ethers";

type Sigs = {
	v: number;
	r: `0x${string}`;
	s: `0x${string}`;
}[];

/** recover r, s, v from signatures */
export function recoverSignatures(
	signers: readonly `0x${string}`[],
	signs: readonly `0x${string}`[],
	threshold: number
): Sigs {
	// sort out signs by address in ascending order
	const signerToSign: Record<`0x${string}`, `0x${string}`> = {};
	signers.forEach((signer, i) => {
		signerToSign[signer] = signs[i];
	});

	const sortedSignerToSign: typeof signerToSign = {};
	Object.keys(signerToSign)
		.sort()
		.forEach((item) => {
			const addr = item as `0x${string}`;
			sortedSignerToSign[addr] = signerToSign[addr];
		});

	// recover r, s, v from signatures
	const rsvList: Sigs = [];
	if (threshold > Object.keys(sortedSignerToSign).length) {
		return rsvList;
	}

	for (let i = 0; i < threshold; i++) {
		const sig = ethers.utils.splitSignature(
			Object.values(sortedSignerToSign)[i]
		);
		const v = sig.v;
		const r = sig.r as `0x${string}`;
		const s = sig.s as `0x${string}`;
		const rsv = { v, r, s };
		rsvList.push(rsv);
	}

	return rsvList;
}
