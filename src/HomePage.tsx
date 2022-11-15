import JSABLogo from "./assets/jsab-icon.png";

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
									Problem?
								</a>
							</li>
							<li className="nav-item">
								<a rel="noopener" target="_blank" className="nav-link" href="https://www.justshapesandbeats.com/">
									Get JSAB
								</a>
							</li>
						</ul>
					</div>
				</div>
				<hr />
			</nav>
			<div className="container text-center">
				<h1>JSAB Tracker</h1>
				<p>Welcome to the JSAB Tracker!</p>
			</div>
		</>
	);
}
