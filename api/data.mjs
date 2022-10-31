import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const original = JSON.parse(fs.readFileSync(path.join(__dirname, "levels.json"), "utf8"));

class Data {
	data;

	constructor() {
		this.data = JSON.parse(fs.readFileSync(path.join(__dirname, "info.json"), "utf8"));
	}

	set(id, rank, dash) {
		this.data[id] = { ...this.data[id], rank: rank, dash: Number(dash) };
	}

	async save() {
		return await fs.promises.writeFile(path.join(__dirname, "info.json"), JSON.stringify(this.data));
	}
}

const data = new Data();
export default data;

