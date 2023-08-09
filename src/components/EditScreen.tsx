import React from "react";
import { Data, URLManager, Utils } from "../utils";

export default class EditScreen extends React.Component<{}, RankInfo & { id: IDRange; data?: DataInfo }> {
	constructor(props: Record<string, unknown>) {
		super(props);
		const editid = this.getEditID();
		if (!Data.isValidID(editid)) {
			this.gotomain();
		} else {
			this.setState({ id: editid });
		}
	}

	getEditID(): -1 | IDRange {
		const params = new URLSearchParams(window.location.search).get("id");
		if (!params || Number.isNaN(Number(params))) {
			return -1;
		} else {
			if (Number(params) < 1 || Number(params) > 54) return -1;
			return Number(params) as IDRange;
		}
	}

	componentDidMount(): void {
		Data.getSingleFullTrackInfo(Utils.getUid() as string, this.state.id).then((d) =>
			this.setState({ data: d }),
		);
	}

	gotomain(id?: IDRange) {
		if (id) {
			URLManager.goto(`/main?goto=${id}`);
		} else {
			URLManager.goto(`/main`);
		}
	}

	render() {
		return (
			<div id="edit" className="container px-5 my-5">
				<div className="mb-3">
					{this.state.data ? (
						<div className="container px-5 my-5">
							<form className="form" id="edit-form">
								<input aria-hidden="true" type="hidden" name="id" value={this.state.data.id} />
								<div className="mb-3">
									<span>
										{this.state.data.name} - {this.state.data.artist}
									</span>
								</div>
								<div className="mb-3">
									<label className="form-label" htmlFor="normalRank">
										Normal Rank
									</label>
									<select
										defaultValue={this.state.data.normal.rank}
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
										defaultValue={
											Data.isValidDash(this.state.data.normal.dash)
												? this.state.data.normal.dash
												: "Error"
										}
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
										defaultValue={this.state.data.hardcore.rank}
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
										defaultValue={
											Data.isValidDash(this.state.data.normal.dash)
												? this.state.data.normal.dash
												: "Error"
										}
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
									<button
										className="btn btn-primary editbutton"
										onClick={() => {
											const data = Object.entries(this.state)
												.filter(([key]) => ["id", "hardcore", "normal"].includes(key))
												.reduce((obj, [key, val]) => {
													// @ts-ignore
													obj[key] = val;
													return obj;
												}, {} as RankInfo);

											Data.setUserTrackData(
												Utils.getUid() as string,
												data,
												this.state.id,
											).then(() => {
												this.gotomain(this.state.id);
											});
										}}
										type="button">
										Submit
									</button>
									<button
										className="btn btn-primary editbutton"
										onClick={() => this.gotomain(this.state.id)}
										type="button">
										Cancel
									</button>
								</div>
							</form>
						</div>
					) : (
						<span>Loading...</span>
					)}
					<br />
					<button onClick={() => history.back()} type="button" className="btn btn-primary">
						Back
					</button>
				</div>
			</div>
		);
	}
}

