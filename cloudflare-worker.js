addEventListener("fetch", (event) => {
	event.respondWith(handleRequest(event));
});

const jsabassets = "https://jsab-tracker.vercel.app";
const otherfiles = "https://raw.githubusercontent.com/tpguy825/other/master/public/cdn";
const count = () => fetch("https://api.countapi.xyz/hit/cdn.tpguy825.cf-files", { method: "GET" }).then((r) => r.json())
// NOTE: to get the actual count, divide it by 2. If it's odd, -1

/**
 * @param {Event} event
 *
 * @return {Promise<Response>}
 */
async function serveAsset(event) {
	const url = new URL(event.request.url);
	if(url.pathname.startsWith("/files/Onett")) console.warn((await count()).value)
	const cache = caches.default;
	let response = await cache.match(event.request);
	if (!response) {
		const fetchurl = getUrl(url.pathname)
		if (fetchurl instanceof Response) {
			return fetchurl;
		}
		response = await fetch(fetchurl);
		const headers = { "cache-control": "public, max-age=14400" };
		response = new Response(response.body, { ...response, headers });
		event.waitUntil(cache.put(event.request, response.clone()));
	}
	return response;
}

/**
 * @param {string} pathname
 * 
 * @return {string | Response}
 */
function getUrl(pathname) {
	if (pathname.startsWith("/jsab")) {
		return `${jsabassets}${pathname.slice(5)}`;
	} else if(pathname.startsWith("/files")) {
		return `${otherfiles}${pathname.slice(6)}`
	} else {
		return new Response("Invalid path", { status: 404 });
	}
}

 /**
  * @param {Event} event
  * 
  * @return {Promise<Response>}
  */
async function handleRequest(event) {
	if (event.request.method === "GET") {
		let response = await serveAsset(event);
		if (response.status > 399) {
			response = new Response(response.statusText, { status: response.status });
		}
		return response;
	} else {
		return new Response("Method not allowed", { status: 405 });
	}
}
