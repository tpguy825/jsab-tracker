import * as fs from "fs";

const ranks = JSON.parse(fs.readFileSync("ranks.json", "utf8"));
const tracks = JSON.parse(fs.readFileSync("tracks.json", "utf8"));

let tracksfinal = {};
let ranksfinal = {};

for (let i = 0; i < tracks.length; i++) {
	const trackinfo = tracks[i];

	tracksfinal[i + 1] = {
		id: trackinfo.id,
		name: trackinfo.name,
		artist: trackinfo.artist,
		world: trackinfo.world,
		checkpoints: trackinfo.checkpoints,
		boss: trackinfo.boss,
		notes: trackinfo.notes,
		added: trackinfo.added,
	};
}

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

fs.writeFileSync("full.json", JSON.stringify({ tracks: tracksfinal, users: { tpguy825: { ranks: ranksfinal } } }));
