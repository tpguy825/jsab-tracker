import { Data, LoginManager, URLManager, Utils } from "../utils";
import { Component } from "preact"
import type { Go } from "../main";
const JSABS = "https://cdn.tpguy825.cf/jsab/assets/jsab-s.png";

interface AppProps {
	go: Go;
}

export default class Main extends Component<AppProps, AppState> {
	hostname: string;
	state: Readonly<AppState> = {};
	go: Go;

	constructor({ go }: AppProps) {
		super({ go });

		this.go = go;

		this.hostname = URLManager.gethostname();
		if (this.hostname === "localhost") {
			this.hostname = "http://localhost:80";
		}
	}

	async getTable() {
		let data = this.state.data;
		if (!data) {
			data = await Data.getFullTracksInfo(Utils.getUid() as string, this.go);
			this.setState({ data, table: undefined });
		} else {
			this.setState({ table: undefined})
				}

		const table = Data.recordForEach(data).map(([id, row]) => {
			return <tr key={id}>
				<th id={`track-${id}`} scope="row">
					{id}
				</th>
				<td>{row.name}</td>
				{this.parserank(row.normal.rank)}
				{this.parsedash(row.normal.dash)}
				{this.parserank(row.hardcore.rank)}
				{this.parsedash(row.hardcore.dash)}
				<td>
					<button type="button" className="btn btn-primary" onClick={() => this.gotoedit(row.id)}>
						Edit
					</button>
				</td>
			</tr>
		}, this);

		// todo: add a progress bar at the top of the screen
		// - one for coverage
		// - another for total progress
		//    - this one might be difficult as some levels can't be completed with "No Dash" (e.g. Spectra, Try This, etc.)
		this.setState({
			table,
		});
	}

	gotoedit(id: IDRange) {
		this.go("edit", id)
	}

	async componentDidMount() {
		if (!LoginManager.loggedin()) {
			this.go("login");
			return;
		}

		await this.getTable();
		const query = new URLSearchParams(location.search).get("goto");
		if (query) {
			const idtableelement = document.getElementById(`track-${query}`);
			if (idtableelement) {
				idtableelement.scrollIntoView();
			}
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

	render() {
		if (!LoginManager.loggedin()) {
			this.go("login")
			return <span>Redirecting to login page...</span>;
		}
		console.log(this.state);

		return (
			<div className="container">
				<div className="row">
					<div className="col-2">
						<button
							type="button"
							className="btn btn-primary refresh"
							onClick={this.getTable.bind(this)}>
							Refresh
						</button>
					</div>
					<div className="col text-end">
						Logged in as {Utils.getEmail()}. Not you?{" "}
						<button className="btn btn-primary logout" onClick={() => Utils.logout(this.go)} type="button">
							Log out
						</button>
					</div>
				</div>
				<table className="table">
					<thead>
						<tr>
							<th
								className="help idcol"
								title="How far down the track is on the playlist screen"
								scope="col">
								#
							</th>
							<th className="help" title="Track Name" scope="col">
								Name
							</th>
							<th className="help" title="Normal Rank (S, A, B, C or Unknown)" scope="col">
								Normal Rank
							</th>
							<th
								className="help"
								title="Amount of times you dashed in a level on 'Normal' mode"
								scope="col">
								Dash (Normal)
							</th>
							<th className="help" title="Hardcore Rank (S, A, B, C or Unknown)" scope="col">
								Hardcore Rank
							</th>
							<th
								className="help"
								title="Amount of times you dashed in a level on 'Hardcore' mode"
								scope="col">
								Dash (Hardcore)
							</th>
						</tr>
					</thead>
					<tbody id="tablebody">
						{this.state.table ? (
							this.state.table
						) : (
							<tr>
								<td>Loading...</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		);
	}
}


