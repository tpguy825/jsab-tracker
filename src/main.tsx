// Libraries
import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Centralised way of managing project data
import { LoginManager, Utils } from "./utils";

// Components
import Main from "./components/Main";
import Footer from "./components/footer/Footer";
import LoginScreen from "./components/LoginScreen";
import EditScreen from "./components/EditScreen";
import HomePage from "./components/HomePage";
import Extras from "./components/Extras";

// Styles
import "./assets/index.scss";
import "bootstrap/scss/bootstrap.scss";
import { footermessage } from "./config";

if (!LoginManager.loggedin() && window.location.pathname !== "/login") {
	Utils.setLocalStorage("loggedin", "false");
}

// use react router
const router = createBrowserRouter([
	{
		path: "/",
		element: <HomePage />,
	},
	{
		path: "/main",
		element: <Main />,
	},
	{
		path: "/login",
		element: <LoginScreen />,
	},
	{
		path: "/edit",
		element: <EditScreen />,
	},
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<Extras />
		<RouterProvider router={router} />
		<hr />
		<Footer>{footermessage}</Footer>
	</React.StrictMode>,
);

