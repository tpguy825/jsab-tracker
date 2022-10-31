const apihost = "jsab.tpguy825.cf";
const apiport = 443;
const vitehost = "jsab.tpguy825.cf";
const viteport = 443;

let config = {
	apihost: apihost,
	apiport: apiport,
	vitehost: vitehost,
	viteport: viteport,
	apifull: getFullUrl(apihost, apiport),
	vitefull: getFullUrl(vitehost, viteport),
};

function getFullUrl(host, port) {
	if (port === 80 || port === 443) {
		return host;
	} else {
		return `${host}:${port}`;
	}
}

try {
	config.apihost = process.env.APIHOST;
	config.apiport = Number(process.env.APIPORT);
	config.vitehost = process.env.VITEHOST;
	config.viteport = Number(process.env.VITEPORT);
} catch (e) {
	if (!(e instanceof ReferenceError)) throw e;
}

console.log(config);

export default config;

