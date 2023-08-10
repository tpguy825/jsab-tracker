import { useState } from "preact/hooks";
import { LoginManager } from "../utils";
import { Github, Google } from "./footer/Icons";
import type { Go } from "../main";

export default function LoginScreen({ go }: { go: Go }) {
	if (LoginManager.loggedin()) {
		go("main");
		return <span>Redirecting to main page...</span>;
	}
	const [error, setError] = useState("");
	return (
		<>
			<button type="button" className="btn btn-primary login-goback" onClick={() => go("home")}>
				Go Home
			</button>
			<div className="container text-center">
				<span>
					<h2>Log in</h2>
					<button
						type="button"
						className="btn btn-primary github-login login-button"
						onClick={async () => {
							const result = await LoginManager.sendLoginRedirect("github", go);
							if (!result.success) {
								setError(result.error);
							}
						}}>
						{Github} Log in with GitHub
					</button>
					<br />
					<button
						type="button"
						className="btn btn-primary google-login login-button"
						onClick={async () => {
							const result = await LoginManager.sendLoginRedirect("google", go);
							if (!result.success) {
								setError(result.error);
							}
						}}>
						{Google} Log in with Google
					</button>
					<br />
					<span>
						Want another provider on here?{" "}
						<a
							rel="noopener"
							target="_blank"
							href="https://github.com/tpguy825/jsab-tracker/issues/new">
							Submit your request here
						</a>
					</span>

					<br />
					<span className="error">{error}</span>
				</span>
			</div>
		</>
	);
}
