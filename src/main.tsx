// Libraries
import { type ComponentChild, render } from "preact";

// Components
import MainScreen from "./components/Main";
import Footer from "./components/footer/Footer";
import LoginScreen from "./components/LoginScreen";
import EditScreen from "./components/EditScreen";
import HomePage from "./components/HomePage";
import Extras from "./components/Extras";

// Styles
import "./assets/index.css";
import { footermessage } from "./config";
import { useEffect, useState } from "preact/hooks";
import { Data, LoginManager, URLManager, Utils } from "./utils";

const validpaths = ["main", "login", "edit", "home"] as const;
type Paths = (typeof validpaths)[number];
function useGo() {
	const [screen, setScreen] = useState<Paths>(
		(["/main", "/login", "/edit"] as const).includes(location.pathname)
			? (location.pathname.slice(1) as Exclude<Paths, "home">)
			: "home",
	);
	const listeners: (() => void)[] = [];
	interface GoFunc {
		(where: "home" | "login", id?: void): void;
		(where: "edit", id: IDRange): void;
		(where: "main", id?: IDRange): void;
	}
	const go: GoFunc = (where, id) => {
		listeners.forEach((cb) => cb());
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
	return [
		screen,
		go,
		(cb: () => void) => {
			listeners.push(cb);
		},
	] as const;
}
export type AddListener = ReturnType<typeof useGo>[2];
export type Go = ReturnType<typeof useGo>[1];
export type Screens = ReturnType<typeof useGo>[0];

if (!LoginManager.loggedin() && window.location.pathname !== "/login") {
	Utils.setLocalStorage("loggedin", "false");
}

function getRoute(screen: Screens, go: Go, addListener: AddListener): ComponentChild {
	switch (screen) {
		case "home":
			return <HomePage go={go} addListener={addListener} />;
		case "main":
			return <MainScreen go={go} />;
		case "login":
			return <LoginScreen go={go} />;
		case "edit":
			return <EditScreen go={go} />;
		default:
			return <HomePage go={go} addListener={addListener} />;
	}
}

function Main() {
	const [screen, go, addListener] = useGo();

	useEffect(() => {
		addEventListener("popstate", ({ state }) => {
			console.log(state, location.pathname.slice(1));
			let thing = location.pathname.slice(1) === "" ? "home" : location.pathname.slice(1);
			if (state === "jsab__push") {
				switch (thing) {
					case "home":
						go("home");
						break;
					case "main":
						go("main");
						break;
					case "login":
						go("login");
						break;
					case "edit":
						const id = Number(new URLSearchParams(URLManager.getquery()).get("id"));
						if (Data.isValidID(id)) go("edit", id);
						else go("main");
						break;
					default:
						go("home");
				}
			}
		});
	}, []);
	return (
		<>
			<Extras />
			{getRoute(screen, go, addListener)}
			<hr class="mx-4 border-zinc-500" />
			<Footer>{footermessage}</Footer>
		</>
	);
}

render(<Main />, document.getElementById("root")!);

