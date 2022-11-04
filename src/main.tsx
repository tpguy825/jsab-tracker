import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";
import * as bootstrap from "bootstrap";
import Footer from "./footer/Footer";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<App />
		<Footer />
	</React.StrictMode>
);

