import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class Data {
	data;

	constructor() {
		this.data = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json"), "utf8"));
	}

	add(id, rank, dash) {
		this.data[id] = { ...this.data[id], rank, dash };
	}

	async save() {
		return await fs.promises.writeFile(path.join(__dirname, "data.json"), JSON.stringify(this.data));
	}
}
