import * as fs from "fs";
import https from "https";
import querystring from "querystring";
import chalk from "chalk";
export default undefined;

// Code that runs after the build is complete.

// this further minifies the main js code
const mainjs = fs.readdirSync("dist/assets").filter((filename) => filename.endsWith(".js"))[0];
const partytown = fs.readdirSync("dist/~partytown").filter((filename) => filename.endsWith(".js"));
const partytowndebug = fs.readdirSync("dist/~partytown/debug").filter((filename) => filename.endsWith(".js"));

minify(`assets/${mainjs}`);

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
	console.log("Minifying", chalk.cyan(jsfilename), "...");

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
					`Reduction from ${chalk.greenBright(original.length)} to ${chalk.greenBright(body.length)} (${chalk.greenBright(
						getPercentageChange(original.length, body.length)
					)}% difference). Writing to ${chalk.cyan("dist/${jsfilename}")}...`
				);
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
	console.log(`Send HTTP request for ${chalk.cyan(jsfilename)}...`);
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
