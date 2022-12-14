import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Data, URLManager, Utils } from "@src/DataManager";
import $ from "jquery";

export default class EditScreen extends React.Component<{}, { id: IDRange }> {
	rankelement?: HTMLSelectElement;
	dashelement?: HTMLSelectElement;

	constructor(props: any) {
		super(props);

		if (!Data.isValidID(this.getEditID())) {
			this.gotomain();
		} else {
			this.state = { id: this.getEditID() as IDRange };
		}
	}

	getEditID() {
		const params = new URLSearchParams(window.location.search).get("id");
		if (!params || Number.isNaN(Number(params))) {
			return -1;
		} else {
			return Number(params);
		}
	}

	componentDidMount(): void {
		this.form();
	}

	gotomain(id?: IDRange) {
		if (id) {
			URLManager.goto(`/main?goto=${id}`);
		} else {
			URLManager.goto(`/main?goto=1`);
		}
	}

	jsxtohtml(jsx: JSX.Element, type: string = "div") {
		const output = document.createElement(type);
		const staticElement = renderToStaticMarkup(jsx);
		output.innerHTML = staticElement;
		return output;
	}

	form(): void {
		const edit = document.getElementById("edit") as HTMLElement;
		Data.getSingleFullTrackInfo(Utils.getUid() as string, this.state.id).then((data) => {
			edit.replaceChildren(
				this.jsxtohtml(
					<div className="container px-5 my-5">
						<form className="form" id="edit-form">
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
									<option value="S" className="s-rank-text">
										S
									</option>
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
									defaultValue={Data.isValidDash(data.normal.dash) ? data.normal.dash : "Error"}
									className="form-select"
									id="normalDash"
									name="normalDash"
									aria-label="Normal Dash Count">
									<option value="0" className="nodash">
										What Dash? (No Dash)
									</option>
									<option value="1">Slow Poke (1-10 times)</option>
									<option value="2">{">"} 10 times</option>
									<option value="3">Unknown</option>
									<option value="Error" disabled>
										Error
									</option>
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
									<option value="S" className="s-rank-text">
										S
									</option>
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
									defaultValue={Data.isValidDash(data.normal.dash) ? data.normal.dash : "Error"}
									className="form-select"
									id="hardcoreDash"
									name="hardcoreDash"
									aria-label="Hardcore Dash Count">
									<option value="0" className="nodash">
										What Dash? (No Dash)
									</option>
									<option value="1">Slow Poke (1-10 times)</option>
									<option value="2">{">"} 10 times</option>
									<option value="3">Unknown</option>
									<option value="Error" disabled>
										Error
									</option>
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
		this.editformloop(this.state.id);
	}

	editformloop(id: IDRange) {
		if ($("#edit-form")[0] !== undefined) {
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

							const data: RankInfo = {
								id: id,
								normal: {
									rank: normalRank.value as Rank,
									dash: Number(normalDash.value) as DashCount,
								},
								hardcore: {
									rank: hardcoreRank.value as Rank,
									dash: Number(hardcoreDash.value) as DashCount,
								},
							};

							Data.setUserTrackData(Utils.getUid() as string, data, id).then(() => {
								this.gotomain(id);
							});
						} else if (clickedElement && clickedElement.id === "cancelButton") {
							this.gotomain(this.state.id);
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

