import * as fs from "fs";
import https from "https";
import querystring from "querystring";
export default undefined;

// Code that runs after the build is complete.

// colours
const green = "\x1B[32m";
const red = "\x1B[31m";
const cyan = "\x1B[36m";
const colourReset = "\x1B[0m";

// this further minifies the main js code
const mainjs = fs.readdirSync("dist/assets").filter((f) => f.endsWith(".js"))[0];
const partytown = fs.readdirSync("dist/~partytown").filter((f) => f.endsWith(".js"));
const partytowndebug = fs.readdirSync("dist/~partytown/debug").filter((f) => f.endsWith(".js"));

partytown.forEach((file) => {
	minify(`~partytown/${file}`);
});

partytowndebug.forEach((debugfile) => {
	minify(`~partytown/debug/${debugfile}`);
});

/**
 * @param {string} jsfilename Name of js file to minify
 *
 * @return {void}
 */
function minify(jsfilename) {
	const original = fs.readFileSync(`dist/${jsfilename}`, "utf8");
	console.log("Minifying", cyan + jsfilename + colourReset, "...");

	const query = querystring.stringify({
		input: original,
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
				body = body.replace(/const /g, "let ");
				body = body.replace(/var /g, "let ");
				console.log(
					jsfilename.startsWith("~partytown/debug") ? `[${red}Debug${colourReset}]` : `[${green}Main${colourReset}]`,
					`Reduction from ${green + original.length + colourReset} to ${green + body.length + colourReset} (${
						green + getPercentageChange(original.length, body.length) + "%" + colourReset
					} difference). Writing to ${cyan + `dist/${jsfilename}` + colourReset}...`
				);
				fs.writeFileSync(`dist/${jsfilename.replace(/\.js/g, ".original.js")}`, original);
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
	console.log(`Send HTTP request for ${cyan + jsfilename + colourReset}...`);
}

/**
 * @param {number} from Original number
 * @param {number} to Changed number
 * @param {number} roundeddigits How many digits to round to (default 4)
 *
 * @return {number} number (percentage)
 *
 * @example getPercentageChange(40, 20) // Returns 50
 * getPercentageChange(40, 30) // Returns 25
 */
function getPercentageChange(from, to, roundeddigits = 4) {
	return roundTo(((from - to) / from) * 100, roundeddigits);
}

/**
 * @param {number} n Number to be rounded
 * @param {number} digits To what decimal place to round to
 * @returns {number} number
 *
 * @source https://stackoverflow.com/a/15762794/16402899 (edit 4)
 */
function roundTo(n, digits) {
	var negative = false;
	if (digits === undefined) {
		digits = 0;
	}
	if (n < 0) {
		negative = true;
		n = n * -1;
	}
	var multiplicator = Math.pow(10, digits);
	n = parseFloat((n * multiplicator).toFixed(11));
	n = (Math.round(n) / multiplicator).toFixed(digits);
	if (negative) {
		n = (n * -1).toFixed(digits);
	}
	return n;
}
