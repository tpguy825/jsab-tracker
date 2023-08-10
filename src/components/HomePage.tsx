const JSABLogo = "https://cdn.tpguy825.cf/jsab/assets/jsab-icon.png";
import { ExternalLink } from "../components/footer/Icons";
import type { Go } from "../main";

export default function HomePage({ go }: { go: Go }) {
	return (
		<>
			{/* Bootstrap navbar */}
			<nav className="navbar navbar-expand-lg navbar-dark sticky-top">
				<div className="container-fluid">
					<a rel="noopener" className="navbar-brand" href="#">
						<img
							src={JSABLogo}
							alt="Logo"
							width="30"
							height="30"
							className="d-inline-block align-text-top"
						/>
						JSAB Tracker
					</a>
					<div className="collapse navbar-collapse" id="navbarNav">
						<ul className="navbar-nav">
							<li className="nav-item">
								<span rel="noopener" className="nav-link active" aria-current="page" role="link" onClick={() => 
									go("home")
								}>
									Home
								</span>
							</li>
							<li className="nav-item">
								<span rel="noopener" className="nav-link" role="link" onClick={() => 
									go("login")
								}>
									Login
								</span>
							</li>
							<li className="nav-item">
								<a
									rel="noopener"
									target="_blank"
									className="nav-link"
									href="https://github.com/tpguy825/jsab-tracker/issues">
									Problem? {ExternalLink}
								</a>
							</li>
							<li className="nav-item">
								<a
									rel="noopener"
									target="_blank"
									className="nav-link"
									href="https://www.justshapesandbeats.com/">
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
				<p>Welcome! This home page is still under construction, so stop by later!</p>
				<button type="button" className="btn btn-primary" onClick={() => go("login")}>
						Log in
					</button>
			</div>
		</>
	);
}
