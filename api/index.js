// file deepcode ignore TooPermissiveCorsHeader: it is for private use only
import express from "express";
import Data , { __dirname } from "./data.mjs";
import bodyParser from "body-parser";
import config from "../src/config.js";


const app = express();
const data = new Data();

/** For use on forms */
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static(__dirname + "/../build"));

app.get("/", (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.send("Hello World!");
});

app.post("/api/send", (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	try {
		let info = JSON.parse(req.body);
		data.add(info.id, info.rank, info.dash);
		data.save();
		res.redirect(`http://${config.vitehost}:${config.viteport}/`);
	} catch (e) {
		res.json({ error: true, message: e.message });
	}
});

app.post("/api/edit", urlencodedParser, (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	try {
		let info = req.body;
		data.add(info.id-1, info.rank, info.dash);
		data.save();
		res.redirect(`http://${config.vitehost}:${config.viteport}/`);
	} catch (e) {
		res.json({ error: true, message: e.message });
	}
});

app.get("/api/track", (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	let sent = false;
	data.data.forEach((e) => {
		if (`${e.id}` === req.query.id) {
			res.json({ error: false, ...e });
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

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});

