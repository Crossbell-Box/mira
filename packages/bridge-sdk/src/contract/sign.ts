import { fromRpcSig } from "ethereumjs-util";

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
		const sig = fromRpcSig(Object.values(sortedSignerToSign)[i]);
		const v = sig.v;
		const r = ("0x" + sig.r.toString("hex")) as `0x${string}`;
		const s = ("0x" + sig.s.toString("hex")) as `0x${string}`;
		const rsv = { v, r, s };
		rsvList.push(rsv);
	}

	return rsvList;
}
