import * as fs from "fs";
import https from "https";
import querystring from "querystring";
export default undefined;

// Code that runs after the build is complete.

// this further minifies the main js code
const mainjs = fs.readdirSync("dist/assets").filter((filename) => filename.endsWith(".js"))[0];
const partytown = fs.readdirSync("dist/~partytown").filter((filename) => filename.endsWith(".js"));
const partytowndebug = fs.readdirSync("dist/~partytown/debug").filter((filename) => filename.endsWith(".js"));

minify(mainjs);

partytown.forEach((file) => {
	minify(file);
});

partytowndebug.forEach((debugfile) => {
	minify(debugfile);
});

function minify(jsfilename) {
	const code = fs.readFileSync(`dist/${jsfilename}`, "utf8");

	const query = querystring.stringify({
		input: code,
	});

	const req = https.request(
		{
			method: "POST",
			hostname: "www.toptal.com",
			path: "/developers/javascript-minifier/api/raw",
		},
		function (res) {
			// if the statusCode isn't what we expect, get out of here
			if (res.statusCode !== 200) {
				console.log("StatusCode=" + res.statusCode);
				return;
			}

			let body = "";
			res.on("data", function (chunk) {
				body += chunk;
			});
			res.on("end", function () {
				fs.writeFileSync(`dist/${jsfilename}`, body);
			});
		}
	);
	req.on("error", (e) => {
		throw e;
	});
	req.setHeader("Content-Type", "application/x-www-form-urlencoded");
	req.setHeader("Content-Length", query.length);
	req.end(query, "utf8");
}
