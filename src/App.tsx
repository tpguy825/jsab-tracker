// file deepcode ignore ReactEventHandlerThis: IT IS
import $ from "jquery";
import Button from "./Button";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import EditScreen from "./EditScreen";

export default class App extends React.Component {
	state: AppState = { res: { data: "Waiting" }, table: [], tablejsx: [], lastrefreshed: "Never" };
	getdata: (callback: (data: DataInfo[]) => any) => void;
	getTable: () => void;

	constructor(props: {}) {
		super(props);

		if (localStorage.getItem("screen") !== "1" && localStorage.getItem("screen") !== "0") {
			localStorage.setItem("screen", "0");
		}

		this.getdata = (callback: (data: DataInfo[]) => any) => {
			$.get(`//${window.location.href}/api/get`, callback);
		};
		this.getTable = () => {
			const tablebody = document.getElementById("tablebody") as HTMLElement;
			tablebody.innerHTML = "<span>Loading...</span>";

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
								<Button
									onClick={() => {
										localStorage.setItem("screen", "1");
										location.reload();
									}}>
									Edit
								</Button>
							</td>
						</>
					);
					html.push(this.jsxtohtml(jsx, "tr"));
					tablebody.innerHTML = "";
					html.forEach((el) => tablebody.appendChild(el));
				});

				this.setState({ ...this.state, lastrefreshed: new Date() });
			});
		};
	}

	updateresponse() {
		$.get(`//${window.location.href}/hello`, (data: string) => {
			this.setState({
				...this.state,
				res: {
					data: data,
					timeout: setTimeout(() => {
						this.setState({
							...this.state,
							res: {
								...this.state.res,
								data: this.state.res.data === "Hello World!" ? "Hello World!" : "No Response",
							},
						});
					}, 2500),
				},
			});
		});
	}

	componentDidMount(): void {
		this.updateresponse();
		this.getTable();
	}

	componentWillUnmount(): void {
		clearTimeout(this.state.res.timeout as NodeJS.Timer);
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

			case "0":
				return 0;

			default:
				return 0;
		}
	}

	getScreen(screen: number): JSX.Element {
		switch (screen) {
			case 1:
				return <EditScreen />;
			default:
				let res =
					this.state.res.data === "Hello World!"
						? "Running"
						: this.state.res.data === "Waiting"
						? "Waiting for response from server"
						: "Server is not responding correctly. Expected 'Hello World!', but got '" + this.state.res.data + "'";
				return (
					<div className="container">
						<div>
							<span>Server status: {res}</span>
							<br />
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

