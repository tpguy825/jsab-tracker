// Libraries
import "bootstrap";
import Router from "preact-router";
import { type ComponentChild, render } from "preact";

// Components
import MainScreen from "./components/Main";
import Footer from "./components/footer/Footer";
import LoginScreen from "./components/LoginScreen";
import EditScreen from "./components/EditScreen";
import HomePage from "./components/HomePage";
import Extras from "./components/Extras";

// Styles
import "./assets/index.scss";
import "bootstrap/scss/bootstrap.scss";
import { footermessage } from "./config";
import { useState } from "preact/hooks";
import { LoginManager, Utils } from "./utils";

function useGo() {
	const [screen, setScreen] = useState<"home" | "main" | "login" | "edit">(
		(["/main", "/login", "/edit"] as const).includes(location.pathname)
			? (location.pathname.slice(1) as "main" | "login" | "edit")
			: "home",
	);
	interface GoFunc {
		(where: "home" | "login", id?: void): void;
		(where: "edit", id: IDRange): void;
		(where: "main", id?: IDRange): void;
	}
	const go: GoFunc = (where, id) => {
		let togo: `/${"" | Exclude<typeof where, "home">}` = `/${where === "home" ? "" : where}`;
		if (where === screen) return;
		if (id) {
			if (where === "main") history.pushState("jsab__push", "", `${togo}?goto=${id}`);
			else history.pushState("jsab__push", "", `${togo}?id=${id}`);
		} else {
			history.pushState("jsab__push", "", togo);
		}
		setScreen(where);
	};
	return [screen, go] as const;
}
export type Go = ReturnType<typeof useGo>[1];
export type Screens = ReturnType<typeof useGo>[0];

if (!LoginManager.loggedin() && window.location.pathname !== "/login") {
	Utils.setLocalStorage("loggedin", "false");
}

function getRoute(screen: Screens, go: Go): ComponentChild {
	switch (screen) {
		case "home":
			return <HomePage go={go} />;
		case "main":
			return <MainScreen go={go} />;
		case "login":
			return <LoginScreen go={go} />;
		case "edit":
			return <EditScreen go={go} />;
		default:
			return <HomePage go={go} />;
	}
}

function Main() {
	const [screen, go] = useGo();
	return (
		<>
			<Extras />
			{getRoute(screen, go)}
			<hr />
			<Footer>{footermessage}</Footer>
		</>
	);
}

render(<Main />, document.getElementById("root") as HTMLElement);

