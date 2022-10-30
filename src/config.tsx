import json from "./config.js"

let config: Config = {
	...json as PartialConfig,
	apifull: `http://${json.apihost}:${json.apiport}`,
	vitefull: `http://${json.vitehost}:${json.viteport}`
};

export default config;