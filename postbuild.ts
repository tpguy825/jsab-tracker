import * as fs from "fs";
export default undefined;

// Code that runs after the build is complete.

const jsfilename = fs.readdirSync("dist/assets").filter((filename) => filename.endsWith(".js"))[0];
const code = fs.readFileSync(`dist/assets/${jsfilename}`, "utf8");

fetch("https://www.toptal.com/developers/javascript-minifier/api/raw", { method: "post", body: code })
	.then((response) => response.text())
	.then((minified) => {
		if (minified.startsWith("{")) {
			console.error("Error minifying code:", minified);
			return;
		}
		fs.writeFileSync(`dist/assets/${jsfilename}`, minified);
	});
