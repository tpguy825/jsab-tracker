import express from 'express';
import Data from './data.mjs';

const app = express();
const data = new Data();

app.get("/", (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.send("Hello World!");
});

app.post("/api/send", (req, res) => {
	res.header("Access-control-Allow-Origin", "*");
	try {
		let info = JSON.parse(req.body);
		data.add(info.id, info.rank, info.dash);
		data.save();
		res.send({ error: false, message: "" });
	} catch (e) {
		res.json({ error: true, message: e.message });
	}
});

app.get("/api/get", (req, res) => {
	res.header("Access-control-Allow-Origin", "*");
	res.json(data.data);
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
