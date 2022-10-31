// file deepcode ignore ReactEventHandlerThis: IT IS
import $ from "jquery";
import Button from "./Button";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import config from "../config";

export default class App extends React.Component {
	state: AppState = { res: "No Response", table: [], tablejsx: [], lastrefreshed: "Never" };
	api: string;
	getdata: (callback: (data: DataInfo[]) => any) => void;
	getTable: () => void;

	constructor(props: {}) {
		super(props);
		this.api = config.apifull;
		console.log({ api: this.api, config });

		this.getdata = (callback: (data: DataInfo[]) => any) => {
			$.get(`//${this.api}/api/get`, callback);
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
		$.get(`//${this.api}/hello`, (data: string) => this.setState({ ...this.state, res: data }));
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

