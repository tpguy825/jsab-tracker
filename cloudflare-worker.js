addEventListener("fetch", (event) => {
	event.respondWith(handleRequest(event));
});

const jsabassets = `http://jsab.tpguy825.cf/assets`;

/**
 * @param {Event} event
 *
 * @return {Promise<Response>}
 */
async function serveAsset(event) {
	const url = new URL(event.request.url);
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
