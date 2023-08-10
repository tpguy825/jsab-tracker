import { defineConfig } from "vite";
import preact from "@prefresh/vite";
import purgecss from "vite-plugin-purgecss";

// https://vitejs.dev/config/
export default defineConfig({
	// @ts-ignore
	plugins: [preact(), purgecss()],
	esbuild: {
		jsxFactory: "h",
		jsxFragment: "Fragment",
	},
});


