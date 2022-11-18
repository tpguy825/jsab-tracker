// file deepcode ignore ReactEventHandlerThis, file deepcode ignore ReactMissingCleanup
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Data, LoginManager, URLManager, Utils } from "./DataManager";
import JSABS from "./assets/jsab-s.png";

export default class App extends React.Component {
	state: AppState = { table: [], tablejsx: [] };
	hostname: string;

	constructor(props: {}) {
		super(props);

		this.hostname = URLManager.gethostname() === "localhost" ? "http://localhost:80" : URLManager.gethostname();
	}

	async getTable() {
		let tablebody = document.getElementById("tablebody");

		let table = tablebody as HTMLElement;

		const data = await Data.getFullTracksInfo(Utils.getUid() as string);
		let jsx = <span>Loading...</span>;
		table.innerHTML = "";
		data.forEach((row) => {
			jsx = (
				<>
					<th scope="row">{row.id}</th>
					<td>{row.name}</td>
					{row.normal.rank === "" ? (
						<td className="unknown">Unknown</td>
					) : row.normal.rank === "S" ? (
						<td>
							<img src={JSABS} alt="S" className="s-rank" />
						</td>
					) : (
						<td>{row.normal.rank}</td>
					)}
					{this.parsedash(row.normal.dash)}
					{row.hardcore.rank === "" ? (
						<td className="unknown">Unknown</td>
					) : row.hardcore.rank === "S" ? (
						<td>
							<img src={JSABS} alt="S" className="s-rank" />
						</td>
					) : (
						<td>{row.hardcore.rank}</td>
					)}
					{this.parsedash(row.hardcore.dash)}
					<td>
						<button type="button" className="btn btn-primary" data-id={`${row.id}`}>
							Edit
						</button>
					</td>
				</>
			);
			const el = this.jsxtohtml(jsx, "tr");

			table.appendChild(el);

			for (let i = 0; i < el.children.length; i++) {
				const buttonmaybe = el.children[i];

				if (buttonmaybe.children[0] !== undefined && buttonmaybe.children[0].nodeName === "BUTTON") {
					const button = buttonmaybe.children[0] as HTMLButtonElement;
					button.addEventListener("click", (ev) => {
						this.gotoedit((ev.target as HTMLElement).dataset.id as string);
					});
				}
			}
		}, this);
	}

	gotoedit(id: string) {
		URLManager.goto(`/edit?id=${id}`);
	}

	async componentDidMount() {
		try {
			await this.getTable();
		} catch (e) {
			console.log(e);
			const timeoutfunc = this.componentDidMount;
			setTimeout(timeoutfunc, 100);
		}
	}

	parsedash(dash: number) {
		switch (dash) {
			case 0:
				return <td className="nodash">No Dash</td>;

			case 1:
				return <td>Slow Poke (1-9)</td>;

			case 2:
				return <td>10+</td>;

			case 3:
				return <td className="unknown">Unknown</td>;

			default:
				return <td className="error">Error</td>;
		}
	}

	jsxtohtml(jsx: JSX.Element, type: string = "div") {
		const output = document.createElement(type);
		const staticElement = renderToStaticMarkup(jsx);
		output.innerHTML = staticElement;
		return output;
	}

	render() {
		if (!LoginManager.loggedin()) {
			URLManager.goto("/login");
			return <span>Redirecting to login page...</span>;
		}

		return (
			<div className="container">
				<div className="row">
					<div className="col-2">
						<button type="button" className="btn btn-primary" id="refreshbutton" onClick={URLManager.reload}>
							Refresh
						</button>
					</div>
					<div className="col text-end">
						Logged in as {Utils.getEmail()}. Not you?{" "}
						<button className="btn btn-primary" onClick={Utils.logout} type="button">
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
					<tbody id="tablebody">
						<tr>
							<td>Loading...</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}

