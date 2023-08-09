import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import purgecss from "vite-plugin-purgecss";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	// @ts-ignore
	plugins: [react(), purgecss()],
});

