const path = require("path");

module.exports = {
	reactStrictMode: true,
	transpilePackages: ["bridge-sdk"],
	output: "standalone",
	experimental: {
		outputFileTracingRoot: path.join(__dirname, "../../"),
	},
};
