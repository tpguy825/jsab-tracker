export default undefined;
import * as fs from "fs";

const newjson: NewJSON[] = JSON.parse(fs.readFileSync("in.json", "utf8"));

// TODO - Finish this!!!
// loop over the newjson array and change it
// Output the results to 
// - out.default.json  (defaultuserprofile)
// - out.me.json       (me)
// - out.tracks.json   (tracks)

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
	normalrank: string;
	normaldash: number;
	hardcorerank: string;
	hardcoredash: number;
}
