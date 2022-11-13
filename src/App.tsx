// file deepcode ignore ReactEventHandlerThis, file deepcode ignore ReactMissingCleanup
import Button from "./Button";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import EditScreen from "./EditScreen";
import { Data, db, getEmail, getLocalStorage, getUid, logout, setLocalStorage } from "./DataManager";
import { get, ref } from "firebase/database";

export default class App extends React.Component {
	state: AppState = { res: { data: "Waiting" }, table: [], tablejsx: [], lastrefreshed: "Never" };
	hostname: string;

	constructor(props: {}) {
		super(props);

		this.hostname = location.hostname === "localhost" ? "http://localhost:80" : location.hostname;

		if (getLocalStorage("screen") !== "1" && getLocalStorage("screen") !== "0") {
			setLocalStorage("screen", "0");
		}
	}

	getTable() {
		let tablebody = document.getElementById("tablebody");

		let table = tablebody as HTMLElement;

		Data.getFullTracksInfo(getUid())
			.then((data) => {
				let html: HTMLElement[] = [];
				let jsx = <span>Loading...</span>;
				data.forEach((row) => {
					jsx = (
						<>
							<th scope="row">{row.id}</th>
							<td>{row.name}</td>
							<td>{row.normal.rank === "" ? "Unknown" : row.normal.rank}</td>
							<td>{this.parsedash(row.normal.dash)}</td>
							<td>{row.hardcore.rank === "" ? "Unknown" : row.hardcore.rank}</td>
							<td>{this.parsedash(row.hardcore.dash)}</td>
							<td>
								<button type="button" className="btn btn-primary" data-id={`${row.id}`}>
									Edit
								</button>
							</td>
						</>
					);
					html.push(this.jsxtohtml(jsx, "tr"));
					table.innerHTML = "";
				});
				html.forEach((el) => {
					table.appendChild(el);
					el.addEventListener("click", (ev) => {
						this.gotoedit(ev.target as HTMLElement);
					});
				});

				this.setState({ ...this.state, lastrefreshed: new Date() });
			})
			.catch((err) => {
				console.error(err);
			});
	}

	gotoedit(row: HTMLElement) {
		setLocalStorage("screen", "1");
		location.href = `/?id=${row.dataset.id}`;
	}

	componentDidMount(): void {
		try {
			if (this.testscreen(getLocalStorage("screen") as string) === 0) {
				this.getTable();
			}
		} catch (e) {
			console.log(e);
			setTimeout(this.componentDidMount, 100);
		}
	}

	parsedash(dash: number) {
		switch (dash) {
			case 0:
				return "No Dash";

			case 1:
				return "Slow Poke (1-9)";

			case 2:
				return "10+";

			case 3:
				return "Unknown";

			default:
				return "Error";
		}
	}

	jsxtohtml(jsx: JSX.Element, type: string = "div") {
		const output = document.createElement(type);
		const staticElement = renderToStaticMarkup(jsx);
		output.innerHTML = staticElement;
		return output;
	}

	testscreen(screen: string): 0 | 1 {
		switch (screen) {
			case "1":
				return 1;

			default:
				return 0;
		}
	}

	getScreen(screen: number): JSX.Element {
		switch (screen) {
			case 1:
				return <EditScreen />;
			default:
				return (
					<div className="container">
						<div className="row">
							<div className="col-2">
								<Button id="refreshbutton" onClick={this.getTable}>
									Refresh
								</Button>
							</div>
							<div className="col text-end">
								Logged in as {getEmail()}. Not you?{" "}
								<button className="btn btn-primary" onClick={logout} type="button">
									Log out
								</button>
							</div>
						</div>
						<table className="table">
							<thead>
								<tr>
									<th className="help idcol" title="How far down the track is on the playlist screen" scope="col">
										#
									</th>
									<th className="help" title="Track Name" scope="col">
										Name
									</th>
									<th className="help" title="Normal Rank (S, A, B, C or Unknown)" scope="col">
										Normal Rank
									</th>
									<th className="help" title="Amount of times you dashed in a level on 'Normal' mode" scope="col">
										Dash (Normal)
									</th>
									<th className="help" title="Hardcore Rank (S, A, B, C or Unknown)" scope="col">
										Hardcore Rank
									</th>
									<th className="help" title="Amount of times you dashed in a level on 'Hardcore' mode" scope="col">
										Dash (Hardcore)
									</th>
								</tr>
							</thead>
							<tbody id="tablebody"></tbody>
						</table>
					</div>
				);
		}
	}

	render() {
		return this.getScreen(this.testscreen(getLocalStorage("screen") as string));
	}
}

