import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import purgecss from "vite-plugin-purgecss";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	// @ts-ignore
	plugins: [react(), purgecss()],

	resolve: {
		alias: {
			"~bootstrap": path.resolve(__dirname, "node_modules/bootstrap"),
			"@src": path.resolve(__dirname, "src"),
			"@assets": path.resolve(__dirname, "src/assets"),
			"@config": path.resolve(__dirname, "config"),
			"@components": path.resolve(__dirname, "src/components"),
		},
	},
});

