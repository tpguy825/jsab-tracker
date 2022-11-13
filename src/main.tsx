import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";
import * as bs from "bootstrap";
import Footer from "./footer/Footer";
import { getLocalStorage, LoginManager, setLocalStorage } from "./DataManager";
import LoginScreen from "./LoginScreen";

if (getLocalStorage("loggedin") !== "true" && getLocalStorage("loggedin") !== "false") {
	setLocalStorage("loggedin", "false");
}

let loginscreendisplayed = LoginManager.loggedin() ? <App /> : <LoginScreen />;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		{loginscreendisplayed}
		<Footer>If you encounter any issues, just refresh the page</Footer>
	</React.StrictMode>
);

