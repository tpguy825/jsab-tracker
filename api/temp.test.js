import * as fs from "fs";

const ranks = JSON.parse(fs.readFileSync("api/ranks.json", "utf8"));

let ranksfinal = [];

for (const i in ranks) {
	if (Object.hasOwnProperty.call(ranks, i)) {
		const rank = ranks[i];

		ranksfinal[i] = {
			id: rank.id,
			normal: {
				rank: "",
				dash: 3,
			},
			hardcore: {
				rank: "",
				dash: 3,
			},
		};
	}
}

fs.writeFileSync("api/default.json", JSON.stringify(ranksfinal));