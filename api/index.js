// file deepcode ignore TooPermissiveCorsHeader
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const app = express();

const port = 80;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const original = JSON.parse(fs.readFileSync(path.join(__dirname, "levels.json"), "utf8"));

let data = JSON.parse(fs.readFileSync(path.join(__dirname, "info.json"), "utf8"));

function set(id, normalRank, normalDash, hardcoreRank, hardcoreDash) {
	data[Number(id)] = { ...data[Number(id)], normal: { rank: normalRank, dash: Number(normalDash) }, hardcore: { rank: hardcoreRank, dash: Number(hardcoreDash) } };
}

function save() {
	return fs.writeFileSync(path.join(__dirname, "info.json"), JSON.stringify(data));
}

const getRequestFrom = (req) => {
	if (req.headers.origin !== undefined) {
		return req.headers.origin;
	} else if (req.headers.referer !== undefined) {
		return req.headers.referer;
	} else {
		return req.headers.host;
	}
};

/** For use on forms */
// const urlencodedParser = bodyParser.urlencoded({ extended: false });

// use cors
app.use(cors());
app.use("/", express.static(__dirname + "/../build"));
app.use((req, res, next) => {
	console.log(`${req.method} ${getRequestFrom(req)}${req.url}`);
	next();
});

app.get("/hello", (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.send("Hello World!");
});

// app.get("/api/edit", urlencodedParser, (req, res) => {
app.get("/api/edit", (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	try {
		console.log(req.query);
		debugger
		set(req.query.id - 1, req.query.normalRank, req.query.normalDash, req.query.hardcoreRank, req.query.hardcoreDash);
		save();
		// deepcode ignore OR
		res.redirect(getRequestFrom(req));
	} catch (e) {
		res.json({ error: true, message: e.message });
	}
});

app.get("/api/track", (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	let sent = false;
	data.forEach((e) => {
		if (`${e.id}` === req.query.id) {
			res.json(e);
			sent = true;
		}
	});
	if (!sent) {
		res.json({ error: true, message: "No data found" });
	}
});

app.get("/api/get", (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.json(data);
});

app.get("/api/original", (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.json(original);
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

export default app;

