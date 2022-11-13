import React from "react";
import { LoginManager } from "./DataManager";

export default class LoginScreen extends React.Component {
	render() {
		return (
			<div className="container text-center">
				<span>
					<h2>Log in</h2>
					<button
						type="button"
						className="btn btn-primary github-login login-button"
						onClick={() => {
							LoginManager.sendLoginRedirect("github");
						}}>
						<i className="bi bi-github"></i> Log in with GitHub
					</button>
					<br />
					<button
						type="button"
						className="btn btn-primary google-login login-button"
						onClick={() => {
							LoginManager.sendLoginRedirect("google");
						}}>
						<i className="bi bi-google"></i> Log in with Google
					</button>
					<br />
					<span>
						Want another provider on here?{" "}
						<a rel="noopener" target="_blank" href="https://github.com/tpguy825/jsab-tracker/issues/new">
							Submit your request here
						</a>
					</span>

					<br />
					<span id="error" className="login-error"></span>
				</span>
			</div>
		);
	}
}
