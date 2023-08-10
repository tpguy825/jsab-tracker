import { defineConfig } from "vite";
import preact from "@prefresh/vite";
import purgecss from "vite-plugin-purgecss";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [preact(), purgecss()],
	esbuild: {
		jsxFactory: "h",
		jsxFragment: "Fragment",
	},
	resolve: {
		alias: {
			react: "preact/compat",
			"react-dom": "preact/compat",
		},
	},
});


