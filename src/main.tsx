import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { LoginManager, Utils } from "./DataManager";

import App from "./App";
import Footer from "./footer/Footer";
import LoginScreen from "./LoginScreen";
import EditScreen from "./EditScreen";
import HomePage from "./HomePage";
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
		<RouterProvider router={router} />
		<hr />
		<Footer>If you encounter any issues, just refresh the page</Footer>
	</React.StrictMode>
);

