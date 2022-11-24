import { readFileSync, writeFileSync } from "fs";

const newjson: NewJSON[] = JSON.parse(readFileSync("in.json", "utf8"));
let outdefault: OutDefault = {},
	outme: OutMe = {},
	outtracks: OutTracks = {};

// tasks:
// ✅ loop over newjson
// ✅ add info to variables
// ✅ write to files
// ✅ Output the results to
// ✅   - out.default.json  (defaultuserprofile)
// ✅   - out.me.json       (me)
// ✅   - out.tracks.json   (tracks)

// loop over the newjson array
newjson.forEach(function (item) {
	outdefault[String(item.id)] = {
		id: item.id,
		name: item.name,
		normal: {
			rank: "",
			dash: 3,
		},
		hardcore: {
			rank: "",
			dash: 3,
		},
	};
	outme[String(item.id)] = {
		id: item.id,
		name: item.name,
		normal: {
			rank: item.normalrank.toUpperCase() as "S" | "A" | "B" | "C",
			dash: item.normaldash,
		},
		hardcore: {
			rank: item.hardcorerank.toUpperCase() as "S" | "A" | "B" | "C",
			dash: item.hardcoredash,
		},
	};
	outtracks[String(item.id)] = {
		id: item.id,
		name: item.name,
		artist: item.artist,
		world: item.world,
		checkpoints: item.checkpoints,
		boss: item.boss,
		notes: item.notes,
		added: item.added,
	};
});

writeFileSync("out.default.json", JSON.stringify(outdefault));
writeFileSync("out.me.json", JSON.stringify(outme));
writeFileSync("out.tracks.json", JSON.stringify(outtracks));

interface NewJSON {
	_key: number;
	id: number;
	name: string;
	artist: string;
	world: string;
	checkpoints: number;
	boss: boolean;
	notes: string;
	added: string;
	normalrank: "c" | "b" | "a" | "s";
	normaldash: DashCount;
	hardcorerank: "c" | "b" | "a" | "s";
	hardcoredash: DashCount;
}

interface OutDefault {
	[key: string]:
		| {
				name: string;
				id: number;
				normal: {
					rank: "";
					dash: 3;
				};
				hardcore: {
					rank: "";
					dash: 3;
				};
		  }
		| undefined;
}

interface OutMe {
	[key: string]:
		| {
				name: string;
				id: number;
				normal: {
					rank: "C" | "B" | "A" | "S";
					dash: DashCount;
				};
				hardcore: {
					rank: "C" | "B" | "A" | "S";
					dash: DashCount;
				};
		  }
		| undefined;
}

interface OutTracks {
	[key: string]:
		| {
				id: number;
				name: string;
				artist: string;
				world: string;
				checkpoints: number;
				boss: boolean;
				notes: string;
				added: string;
		  }
		| undefined;
}

