//@ts-check
/** @type {import("prettier").Options} */
const config = {
	tabWidth: 4,
	useTabs: true,
	printWidth: 115,
	arrowParens: "always",
	bracketSameLine: true,
	bracketSpacing: true,
	singleQuote: false,
	endOfLine: "crlf",
	trailingComma: "all",
	semi: true,
	plugins: ["prettier-plugin-tailwindcss"],
};

export default config;

