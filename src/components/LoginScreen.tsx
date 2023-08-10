import { useState } from "preact/hooks";
import { LoginManager } from "../utils";
import { Github, Google } from "./footer/Icons";
import type { Go } from "../main";

export default function LoginScreen({ go }: { go: Go }) {
	if (LoginManager.loggedin()) {
		go("main");
		return <span>Redirecting to main page...</span>;
	}
	const [error, setError] = useState<string | null>(null);
	return (
		<>
			<button
				type="button"
				className="login-goback inline-block select-none rounded-lg bg-blue-600 px-4 py-2 text-center align-middle font-normal leading-normal text-white no-underline hover:bg-blue-600"
				onClick={() => go("home")}>
				Go Home
			</button>
			<div class="text-center columns-1 mb-6">
				<span class="inline-grid">
					<h2 class="mb-2">Log in</h2>
					<button
						type="button"
						className="mb-2 select-none rounded border border-zinc-600 px-4 py-2 text-white no-underline hover:bg-zinc-900"
						onClick={async () => {
							const result = await LoginManager.sendLoginRedirect("github", go);
							if (!result.success) {
								setError(result.error);
							}
						}}>
						<div className="flex">
							<span className="relative top-1 mr-2">{Github}</span> Log in with GitHub
						</div>
					</button>
					<button
						type="button"
						className="mb-2 select-none rounded border border-zinc-600 px-4 py-2 text-white no-underline hover:bg-zinc-900"
						onClick={async () => {
							const result = await LoginManager.sendLoginRedirect("google", go);
							if (!result.success) {
								setError(result.error);
							}
						}}>
						<div className="flex">
							<span className="relative top-1 mr-2">{Google}</span> Log in with Google
						</div>
					</button>
				</span>
				<span className="block align-bottom">
					<span>
						Want another provider on here?{" "}
						<a
							rel="noopener"
							target="_blank"
							class="hover:text-blue-700 text-blue-600"
							href="https://github.com/tpguy825/jsab-tracker/issues/new">
							Submit your request here
						</a>
					</span>
					{error ? <span className="text-red-500">{error}</span> : ""}
				</span>
			</div>
		</>
	);
}
