import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const original = JSON.parse(fs.readFileSync(path.join(__dirname, "levels.json"), "utf8"));

export class Data {
	data;

	constructor() {
		this.data = JSON.parse(fs.readFileSync(path.join(__dirname, "info.json"), "utf8"));
	}

	set(id, normalRank, normalDash, hardcoreRank, hardcoreDash) {
		this.data[id] = { ...this.data[id], normal: { rank: normalRank, dash: normalDash}, hardcore: { rank: hardcoreRank, dash: hardcoreDash } };
	}

	async save() {
		return await fs.promises.writeFile(path.join(__dirname, "info.json"), JSON.stringify(this.data));
	}
}


