// Libraries
import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Centralised way of managing project data
import { LoginManager, Utils } from "./DataManager";

// Components
import App from "./App";
import Footer from "./footer/Footer";
import LoginScreen from "./LoginScreen";
import EditScreen from "./EditScreen";
import HomePage from "./HomePage";
import Extras from "./Extras";

// Styles
import "./index.scss";

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
		element: <App />,
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
		<Footer>If you encounter any issues, just refresh the page</Footer>
	</React.StrictMode>
);

