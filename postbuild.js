import * as fs from "fs";
import $ from "jquery";
export default undefined;

// Code that runs after the build is complete.

const jsfilename = fs.readdirSync("dist/assets").filter((filename) => filename.endsWith(".js"))[0];
const code = fs.readFileSync(`dist/assets/${jsfilename}`, "utf8");

$.post("https://www.toptal.com/developers/javascript-minifier/api/raw", code)
	.done((minified) => {
		if (minified.startsWith("{")) {
			console.error("Error minifying code:", minified);
			return;
		}
		fs.writeFileSync(`dist/assets/${jsfilename}`, minified);
	});
