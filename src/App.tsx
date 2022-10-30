// file deepcode ignore ReactEventHandlerThis: IT IS
import $ from "jquery";
import Button from "./Button";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import config from "./config";

export default class App extends React.Component {
	state: AppState = { res: "No Response", table: [], tablejsx: [], lastrefreshed: "Never" };
	getdata: (callback: (data: DataInfo[]) => any) => void;
	getTable: () => void;

	constructor(props: {}) {
		super(props);
		this.getdata = (callback: (data: DataInfo[]) => any) => {
			$.get(`http://${config.apihost}:${config.apiport}/api/get`, callback);
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
							<td>{row.rank === "" ? "Unknown" : row.rank}</td>
							<td>{this.parsedash(row.dash)}</td>
							<td>
								<Button href={"/edit?id=" + row.id}>Edit</Button>
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

	componentDidMount() {
		$.get(`http://${config.apihost}:${config.apiport}/`, (data: string) => this.setState({ ...this.state, res: data }));
		document.getElementById("refreshbutton");
		this.getTable();
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

	render() {
		return (
			<div className="container">
				<div>
					<span>Server response: {this.state.res}</span>
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
							<th className="help" title="How far down the track is on the playlist screen" scope="col">
								#
							</th>
							<th className="help" title="Track Name" scope="col">
								Name
							</th>
							<th className="help" title="Rank (S, A, B, C or Unknown)" scope="col">
								Rank
							</th>
							<th className="help" title="Amount of times you dashed in a level" scope="col">
								Dash
							</th>
						</tr>
					</thead>
					<tbody id="tablebody"></tbody>
				</table>
			</div>
		);
	}
}

