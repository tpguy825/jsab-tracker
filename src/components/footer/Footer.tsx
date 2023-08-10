import type { JSX } from "preact/jsx-runtime";
import { Heart, Twitter, Youtube, Github, Code, Bug } from "../footer/Icons";

/**
 * General footer for the website
 */
function Footer({ children }: { children?: JSX.Element | string }): JSX.Element {
	return (
		<div className="mx-4">
			<footer class="">
				<div className="mb-4 flex flex-wrap items-center py-3">
					Made with <span className="mx-1 inline">{Heart}</span> by tpguy825 -
					<a
						class="ml-2 mr-1 flex transition-all duration-200 hover:text-blue-500"
						rel="noopener"
						title="Twitter"
						target="_blank"
						href="https://twitter.com/tpguy825">
						{Twitter}
					</a>
					<a
						class="mx-1 flex transition-all duration-200 hover:text-red-500"
						title="Youtube"
						rel="noopener"
						target="_blank"
						href="https://youtube.com/@tobypayne">
						{Youtube}
					</a>
					<a
						class="ml-1 mr-2 flex transition-all duration-200 hover:text-zinc-900"
						title="Github"
						rel="noopener"
						target="_blank"
						href="https://github.com/tpguy825">
						{Github}
					</a>
					-
					<a
						class="mx-1 flex transition-all duration-200 hover:text-blue-600"
						rel="noopener"
						target="_blank"
						href="https://github.com/tpguy825/jsab-tracker">
						<span className="relative top-1 mr-1">{Code}</span> Source Code
					</a>
					-
					<a
						class="mx-1 flex transition-all duration-200 hover:text-blue-600"
						href="https://github.com/tpguy825/jsab-tracker/issues/new">
						<span className="relative top-1 mr-1">{Bug}</span> Got a problem?
					</a>
					<br class="w-screen" />
					{typeof children === "string" ? <span>{children}</span> : children}
				</div>
			</footer>
		</div>
	);
}

export default Footer;

