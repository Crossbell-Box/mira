const forceProd = false;
const forceDev = false;
export function isProd() {
	if (forceDev) return false;
	if (forceProd) return true;
	return process.env.NODE_ENV === "production";
}
