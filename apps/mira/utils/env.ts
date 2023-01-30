const forceProd = false;
const forceDev = true;
export function isProd() {
	if (forceDev) return false;
	if (forceProd) return true;
	return process.env.NODE_ENV === "production";
}
