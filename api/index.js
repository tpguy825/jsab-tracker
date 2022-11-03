// file deepcode ignore TooPermissiveCorsHeader
import express from "express";
import data, { __dirname, original } from "./data.mjs";
import bodyParser from "body-parser";
import config from "../config/index.mjs";
import cors from "cors";

const app = express();

const port = 80;

/** For use on forms */
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// use cors
app.use(cors());
app.use(express.static(__dirname + "/../build"));
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`);
	next();
});

app.get("/hello", (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.send("Hello World!");
});

app.post("/api/edit", urlencodedParser, (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	try {
		let info = req.body;
		data.set(info.id - 1, info.normal, info.hardcore);
		data.save();
		res.redirect(`http://${config.vitefull}/`);
	} catch (e) {
		res.json({ error: true, message: e.message });
	}
});

app.get("/api/track", (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	let sent = false;
	data.data.forEach((e) => {
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
	res.json(data.data);
});

app.get("/api/original", (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.json(original);
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

export default app;

