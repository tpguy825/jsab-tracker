// file deepcode ignore ReactEventHandlerThis, file deepcode ignore ReactMissingCleanup
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Data, LoginManager, URLManager, Utils } from "../DataManager";
const JSABS = "https://cdn.tpguy825.cf/jsab/assets/jsab-s.png";

export default class Main extends React.Component {
	state: AppState = { table: [], tablejsx: [] };
	hostname: string;
	data?: KeyArray<IDRange, DataInfo>;

	constructor(props: {}) {
		super(props);

		this.hostname = URLManager.gethostname();
		if (this.hostname === "localhost") {
			this.hostname = "http://localhost:80";
		}
	}

	async getTable() {
		let tablebody = document.getElementById("tablebody");

		let table = tablebody as HTMLElement;

		if (this.data === undefined) {
			this.data = await Data.getFullTracksInfo(Utils.getUid() as string);
		}

		let jsx = <span>Loading...</span>;
		table.innerHTML = "";

		// todo: add a progress bar at the top of the screen
		// - one for coverage
		// - another for total progress
		//    - this one might be difficult as some levels can't be completed with "No Dash" (e.g. Spectra, Try This, etc.)
		Data.keyArrayForEach(this.data, (row) => {
			jsx = (
				<>
					<th id={`track-${row.id}`} scope="row">
						{row.id}
					</th>
					<td>{row.name}</td>
					{this.parserank(row.normal.rank)}
					{this.parsedash(row.normal.dash)}
					{this.parserank(row.hardcore.rank)}
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
						this.gotoedit(Number((ev.target as HTMLElement).dataset.id) as IDRange);
					});
				}
			}
		});
	}

	gotoedit(id: IDRange) {
		URLManager.goto(`/edit?id=${id}`);
	}

	async componentDidMount() {
		try {
			await this.getTable();
		} catch (e) {
			console.log(e);
			type timeoutfunc = (getTable: () => Promise<void>, nextfunc: timeoutfunc, i: number) => Promise<void>;
			const timeoutfunc: timeoutfunc = async (getTable, nextfunc, i) => {
				if (i > 5) {
					URLManager.goto("/login");
					return;
				}

				try {
					await getTable();
				} catch (e) {
					console.log(e);
					setTimeout(() => nextfunc(getTable, nextfunc, i + 1), 300);
				}
			};
			setTimeout(() => timeoutfunc(this.getTable, timeoutfunc, 1), 300);
		}
	}

	parserank(rank: Rank) {
		switch (rank) {
			case "":
				return <td className="unknown">Unknown</td>;

			case "S":
				return (
					<td>
						<img src={JSABS} alt="S" className="s-rank" />
					</td>
				);

			default:
				return <td>{rank}</td>;
		}
	}

	parsedash(dash: DashCount) {
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

	jsxtohtml(jsx: JSX.Element, type = "div") {
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

