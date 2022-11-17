import * as fs from "fs";

const ranks = JSON.parse(fs.readFileSync("api/ranks.json", "utf8"));

let ranksfinal = {};

for (let i = 0; i < ranks.length; i++) {
	const trackinfo = ranks[i];

	ranksfinal[i + 1] = {
		id: trackinfo.id,
		normal: {
			rank: trackinfo.normal.rank,
			dash: trackinfo.normal.dash,
		},
		hardcore: {
			rank: trackinfo.hardcore.rank,
			dash: trackinfo.hardcore.dash,
		},
	};
}

fs.writeFileSync("api/ranks.json", JSON.stringify(ranksfinal));
