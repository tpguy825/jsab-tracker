// file deepcode ignore ReactIncorrectReturnValue, file deepcode ignore DOMXSS, file deepcode ignore ReactDeprecatedElementProp
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Data, getLocalStorage, getUid, setLocalStorage } from "./DataManager";
import $ from "jquery";

export default class EditScreen extends React.Component {
	id: number;
	rankelement?: HTMLSelectElement;
	dashelement?: HTMLSelectElement;
	screen: number;
	hostname: string;

	constructor(props: {}) {
		super(props);
		this.hostname = location.hostname === "localhost" ? "http://localhost:80" : location.hostname;
		let screen = Number(getLocalStorage("screen") as string);
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

	gotomain() {
		setLocalStorage("screen", "0");
		location.href = "/";
	}

	jsxtohtml(jsx: JSX.Element, type: string = "div") {
		const output = document.createElement(type);
		const staticElement = renderToStaticMarkup(jsx);
		output.innerHTML = staticElement;
		return output;
	}

	form() {
		const edit = document.getElementById("edit") as HTMLElement;
		Data.getSingleFullTrackInfo(getUid(), this.id).then((data) => {
			edit.replaceChildren(
				this.jsxtohtml(
					<div className="container px-5 my-5">
						<form className="form" id="edit-form">
							{/* hidden input */}
							<input aria-hidden="true" type="hidden" name="id" value={data.id} />
							<div className="mb-3">
								<span>
									{data.name} - {data.artist}
								</span>
							</div>
							<div className="mb-3">
								<label className="form-label" htmlFor="normalRank">
									Normal Rank
								</label>
								<select
									defaultValue={data.normal.rank}
									className="form-select"
									id="normalRank"
									name="normalRank"
									aria-label="Normal Rank">
									<option value="S">S</option>
									<option value="A">A</option>
									<option value="B">B</option>
									<option value="C">C</option>
									<option value="">Unknown</option>
								</select>
							</div>
							<div className="mb-3">
								<label className="form-label" htmlFor="normalDash">
									Normal Dash Count
								</label>
								<select
									defaultValue={data.normal.dash}
									className="form-select"
									id="normalDash"
									name="normalDash"
									aria-label="Normal Dash Count">
									<option value="0">What Dash? (No Dash)</option>
									<option value="1">Slow Poke (1-10 times)</option>
									<option value="2">{">"} 10 times</option>
									<option value="3">Unknown</option>
								</select>
							</div>
							<div className="mb-3">
								<label className="form-label" htmlFor="hardcoreRank">
									Hardcore Rank
								</label>
								<select
									defaultValue={data.hardcore.rank}
									className="form-select"
									id="hardcoreRank"
									name="hardcoreRank"
									aria-label="Hardcore Rank">
									<option value="S">S</option>
									<option value="A">A</option>
									<option value="B">B</option>
									<option value="C">C</option>
									<option value="">Unknown</option>
								</select>
							</div>
							<div className="mb-3">
								<label className="form-label" htmlFor="hardcoreDash">
									Hardcore Dash Count
								</label>
								<select
									defaultValue={data.hardcore.dash}
									className="form-select"
									id="hardcoreDash"
									name="hardcoreDash"
									aria-label="Hardcore Dash Count">
									<option value="0">What Dash? (No Dash)</option>
									<option value="1">Slow Poke (1-10 times)</option>
									<option value="2">{">"} 10 times</option>
									<option value="3">Unknown</option>
								</select>
							</div>
							<div className="d-grid">
								<button className="btn btn-primary editbutton" id="submitButton" type="button">
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
		});
		this.editformloop(this.id);
	}

	editformloop(id: number) {
		if ($("#edit-form")[0] !== undefined) {
			console.log("Wooooo!");
			console.log($("#edit-form"));
			$("#edit-form")
				.get()
				.forEach((el) => {
					el.addEventListener("click", (e) => {
						const clickedElement = e.target as HTMLElement;
						const form = e.currentTarget as HTMLFormElement;
						if (clickedElement && clickedElement.id === "submitButton") {
							const normalRank = document.getElementById("normalRank") as HTMLSelectElement;
							const normalDash = document.getElementById("normalDash") as HTMLSelectElement;
							const hardcoreRank = document.getElementById("hardcoreRank") as HTMLSelectElement;
							const hardcoreDash = document.getElementById("hardcoreDash") as HTMLSelectElement;
					
							const data = {
								id: id,
								normal: {
									rank: normalRank.value,
									dash: Number(normalDash.value),
								},
								hardcore: {
									rank: hardcoreRank.value,
									dash: Number(hardcoreDash.value),
								},
							};
					
							Data.setUserTrackData(getUid(), data, id).then(() => {
								setLocalStorage("screen", "0");
								location.href = "/";
							});
						} else if (clickedElement && clickedElement.id === "cancelButton") {
							setLocalStorage("screen", "0");
							location.href = "/";
						}
					});
				});
		} else {
			setTimeout(() => this.editformloop(id), 500);
		}
	}

	render() {
		return (
			<div id="edit" className="container px-5 my-5">
				<div className="mb-3">
					<span>Loading...</span>
					<br />
					<button onClick={() => history.back()} type="button" className="btn btn-primary">
						Back
					</button>
				</div>
			</div>
		);
	}
}

