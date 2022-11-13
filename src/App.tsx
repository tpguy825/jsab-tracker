// file deepcode ignore ReactEventHandlerThis, file deepcode ignore ReactMissingCleanup
import Button from "./Button";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import EditScreen from "./EditScreen";
import { Data, db, getEmail, getLocalStorage, getUid, logout, setLocalStorage } from "./DataManager";
import { get, ref } from "firebase/database";
import { getAuth } from "firebase/auth";

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
							{row.normal.rank === "" ? <td className="unknown">Unknown</td> : <td>{row.normal.rank}</td>}
							{this.parsedash(row.normal.dash)}
							{row.hardcore.rank === "" ? <td className="unknown">Unknown</td> : <td>{row.hardcore.rank}</td>}
							{this.parsedash(row.hardcore.dash)}
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

					for (let i = 0; i < el.children.length; i++) {
						const buttonmaybe = el.children[i];

						if (buttonmaybe.children[0] !== undefined && buttonmaybe.children[0].nodeName === "BUTTON") {
							const button = buttonmaybe.children[0] as HTMLButtonElement;
							button.addEventListener("click", (ev) => {
								this.gotoedit(ev.target as HTMLElement);
							});
						}
					}
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

	componentDidMount() {
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
				return <td>No Dash</td>;

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
								{/* <Button id="refreshbutton" onClick={this.getTable}> */}
								<Button
									id="refreshbutton"
									onClick={() => {
										console.log(getAuth(db.app).currentUser);
									}}>
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

