import JSABLogo from "./assets/jsab-icon.png";
import { ExternalLink } from "./footer/Icons";

export default function HomePage() {
	return (
		<>
			{/* Bootstrap navbar */}
			<nav className="navbar navbar-expand-lg navbar-light sticky-top">
				<div className="container-fluid">
					<a rel="noopener" className="navbar-brand" href="#">
						<img src={JSABLogo} alt="Logo" width="30" height="30" className="d-inline-block align-text-top" />
						JSAB Tracker
					</a>
					<div className="collapse navbar-collapse" id="navbarNav">
						<ul className="navbar-nav">
							<li className="nav-item">
								<a rel="noopener" className="nav-link active" aria-current="page" href="/">
									Home
								</a>
							</li>
							<li className="nav-item">
								<a rel="noopener" className="nav-link" href="/login">
									Login
								</a>
							</li>
							<li className="nav-item">
								<a rel="noopener" target="_blank" className="nav-link" href="https://github.com/tpguy825/jsab-tracker/issues">
									Problem? {ExternalLink}
								</a>
							</li>
							<li className="nav-item">
								<a rel="noopener" target="_blank" className="nav-link" href="https://www.justshapesandbeats.com/">
									Get JSAB {ExternalLink}
								</a>
							</li>
						</ul>
					</div>
					<button
						className="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarNav"
						aria-controls="navbarNav"
						aria-expanded="false"
						aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
				</div>
				<hr />
			</nav>
			<div className="container text-center">
				<p>Welcome! This page is still under construction, so stop by later!</p>
				<a href="/login">
					<button type="button" className="btn btn-primary">
						Log in
					</button>
				</a>
			</div>
		</>
	);
}
