// file deepcode ignore ReactIncorrectReturnValue, file deepcode ignore DOMXSS, file deepcode ignore ReactDeprecatedElementProp
import React from "react";
import $ from "jquery";
import { renderToStaticMarkup } from "react-dom/server";

export default class EditScreen extends React.Component {
	id: number;
	rankelement?: HTMLSelectElement;
	dashelement?: HTMLSelectElement;
	screen: number;

	constructor(props: {}) {
		super(props);
		let screen = Number(localStorage.getItem("screen") as string);
		this.screen = screen || 0;

		let params = new URLSearchParams(window.location.search).get("id");
		if (!params) {
			params = "0";
		}
		this.id = Number(params);
		if (this.id < 1 || this.id > 54) {
			this.gotomain();
		}
	}

	componentDidMount(): void {
		if (this.screen !== 1) {
			this.gotomain();
		}

		this.form();
	}

	sendedit(nrank: string, ndash: string, hrank: string, hdash: string): void {
		$.post(
			`//${window.location.hostname}/api/edit`,
			JSON.stringify({
				id: this.id,
				normal: {
					rank: nrank,
					dash: ndash,
				},
				hardcore: {
					rank: hrank,
					dash: hdash,
				},
			})
		);
	}

	gotomain() {
		localStorage.setItem("screen", "0");
		location.reload();
	}

	jsxtohtml(jsx: JSX.Element, type: string = "div") {
		const output = document.createElement(type);
		const staticElement = renderToStaticMarkup(jsx);
		output.innerHTML = staticElement;
		return output;
	}

	form() {
		const info = fetch("//" + window.location.hostname + "/api/track?id=" + this.id);
		const edit = document.getElementById("edit") as HTMLElement;
		info.then((res) => res.json())
			.then((data: DataInfo) => {
				edit.replaceChildren(
					this.jsxtohtml(
						<div className="container px-5 my-5">
							<form className="form" method="post" onSubmit={() => this.gotomain()} action={`//${window.location.hostname}/api/edit`}>
								<div className="mb-3">
									<span>
										{data.name} - {data.artist}
									</span>
								</div>
								<div className="mb-3">
									<label className="form-label" htmlFor="normalRank">
										Normal Rank
									</label>
									<select className="form-select" id="normalRank" name="normalRank" aria-label="Normal Rank">
										<option selected={data.normal.rank === "A"} value="A">
											A
										</option>
										<option selected={data.normal.rank === "S"} value="S">
											S
										</option>
										<option selected={data.normal.rank === "B"} value="B">
											B
										</option>
										<option selected={data.normal.rank === "C"} value="C">
											C
										</option>
									</select>
								</div>
								<div className="mb-3">
									<label className="form-label" htmlFor="normalDash">
										Normal Dash Count
									</label>
									<select className="form-select" id="normalDash" name="normalDash" aria-label="Normal Dash Count">
										<option value="0">What Dash? (No Dash)</option>
										<option value="1">Slow Poke (1-10 times)</option>
										<option value="2">{">"} 10 times</option>
									</select>
								</div>
								<div className="mb-3">
									<label className="form-label" htmlFor="hardcoreRank">
										Hardcore Rank
									</label>
									<select className="form-select" id="hardcoreRank" name="hardcoreRank" aria-label="Hardcore Rank">
										<option selected={data.hardcore.rank === "A"} value="A">
											A
										</option>
										<option selected={data.hardcore.rank === "S"} value="S">
											S
										</option>
										<option selected={data.hardcore.rank === "B"} value="B">
											B
										</option>
										<option selected={data.hardcore.rank === "C"} value="C">
											C
										</option>
									</select>
								</div>
								<div className="mb-3">
									<label className="form-label" htmlFor="hardcoreDash">
										Hardcore Dash Count
									</label>
									<select className="form-select" id="hardcoreDash" name="hardcoreDash" aria-label="Hardcore Dash Count">
										<option value="0">What Dash? (No Dash)</option>
										<option value="1">Slow Poke (1-10 times)</option>
										<option value="2">{">"} 10 times</option>
									</select>
								</div>
								<div className="d-grid">
									<button className="btn btn-primary editbutton" id="submitButton" type="submit">
										Submit
									</button>
									<button className="btn btn-primary editbutton" id="cancelButton" type="button">
										Cancel
									</button>
								</div>
							</form>
						</div>
					)
				);
			})
			.catch((err) => {
				// deepcode ignore DOMXSS
				edit.replaceChildren(
					this.jsxtohtml(
						<div className="container px-5 my-5">
							<div className="mb-3">
								<span>Error: {err}</span>
								<br />
								<button onClick={() => this.gotomain()} type="button" className="btn btn-primary">
									Back
								</button>
							</div>
						</div>
					),
				);
			});
	}

	render() {
		return (
			<div id="edit" className="container px-5 my-5">
				<div className="mb-3">
					<span>Loading...</span>
					<br />
					<button onClick={() => this.gotomain()} type="button" className="btn btn-primary">
						Back
					</button>
				</div>
			</div>
		);
	}
}

