// file deepcode ignore ReactEventHandlerThis, file deepcode ignore ReactMissingCleanup
import $ from "jquery";
import Button from "./Button";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import EditScreen from "./EditScreen";

export default class App extends React.Component {
	state: AppState = { res: { data: "Waiting" }, table: [], tablejsx: [], lastrefreshed: "Never" };
	getdata: (callback: (data: DataInfo[]) => any) => void;
	hostname: string;

	constructor(props: {}) {
		super(props);

		this.hostname = location.hostname === "localhost" ? "http://localhost:80" : location.hostname;

		if (localStorage.getItem("screen") !== "1" && localStorage.getItem("screen") !== "0") {
			localStorage.setItem("screen", "0");
		}

		this.getdata = (callback: (data: DataInfo[]) => any) => {
			$.get(`//${this.hostname}/api/get`, callback);
		};
	}

	getTable() {
		let tablebody = document.getElementById("tablebody");

		let table = tablebody as HTMLElement;

		this.getdata((data) => {
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
		});
	}

	gotoedit(row: HTMLElement) {
		localStorage.setItem("screen", "1");
		location.href = `/?id=${row.dataset.id}`;
	}

	componentDidMount(): void {
		try {
			if (this.testscreen(localStorage.getItem("screen") as string) === 0) {
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
						<div>
							<span>
								Last refreshed: {this.state.lastrefreshed.toString()}
								<Button id="refreshbutton" onClick={this.getTable}>
									Refresh
								</Button>
							</span>
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
		return this.getScreen(this.testscreen(localStorage.getItem("screen") as string));
	}
}

