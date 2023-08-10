const JSABLogo = "https://cdn.tpguy825.cf/jsab/assets/jsab-icon.png";
import { useState } from "preact/hooks";
import { ExternalLink } from "../components/footer/Icons";
import type { AddListener, Go } from "../main";

export default function HomePage({ go, addListener }: { go: Go, addListener: AddListener }) {
	const [mobileHidden, setMobileHidden] = useState(true);
	return (
		<>
			{/* Bootstrap navbar */}

			<nav onMouseLeave={() => setMobileHidden(true)}>
				<div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
					<a href="https://flowbite.com/" class="flex items-center">
						<img class="mr-3" width="28" height="28" alt="JSAB Logo" src={JSABLogo} />
						<span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
							JSAB Tracker
						</span>
					</a>
					<button
						onClick={() => setMobileHidden(t => !t)}
						type="button"
						class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
						aria-controls="navbar"
						aria-expanded={!mobileHidden}>
						<span class="sr-only">Open main menu</span>
						<svg
							class="w-5 h-5"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 17 14">
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M1 1h15M1 7h15M1 13h15"
							/>
						</svg>
					</button>
					<div id="navbar" class={"w-full md:block md:w-auto" + (mobileHidden ? " hidden" : "")}>
						<ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg cursor-pointer select-none md:flex-row md:space-x-8 md:mt-0 md:border-0 dark:border-zinc-700">
							<li>
								<span
									role="link"
									onClick={() => go("home")}
									class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
									Home
								</span>
							</li>
							<li>
								<span
									role="link"
									onClick={() => go("login")}
									class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
									Login
								</span>
							</li>
							<li>
								<a
									rel="noopener"
									target="_blank"
									class="flex py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
									href="https://github.com/tpguy825/jsab-tracker/issues">
									Problem? <span className="relative top-0.5 ml-2">{ExternalLink}</span>
								</a>
							</li>
							<li>
								<a
									rel="noopener"
									target="_blank"
									class="flex py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
									href="https://www.justshapesandbeats.com/">
									Get JSAB <span className="relative top-0.5 ml-2">{ExternalLink}</span>
								</a>
							</li>
						</ul>
					</div>
				</div>
			</nav>

			<div className="text-center">
				<p class="mt-4">Welcome! This home page is still under construction, so stop by later!</p>
				<button
					type="button"
					className="inline-block align-middle text-center select-none m-6 font-normal whitespace-no-wrap rounded-lg py-2 px-4 leading-normal no-underline bg-blue-600 text-white hover:bg-blue-700"
					onClick={() => go("login")}>
					Log in
				</button>
			</div>
		</>
	);
}
