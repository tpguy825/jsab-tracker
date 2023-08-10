import { useEffect, useState } from "preact/hooks";
import { Data, URLManager, Utils } from "../utils";
import type { JSX } from "preact";
import type { Go } from "../main";

export default function EditScreen({ go }: { go: Go }): JSX.Element | null {
	const editid = getEditID();
	if (!Data.isValidID(editid)) {
		go("main");
		return null
	}
	const[rank, setRank] = useState<RankInfo>()
	const[id, setId] = useState(editid)
	const[data, setData] = useState<DataInfo>()

	function getEditID(): -1 | IDRange {
		const params = new URLSearchParams(window.location.search).get("id");
		if (!params || Number.isNaN(Number(params))) {
			return -1;
		} else {
			if (Number(params) < 1 || Number(params) > 54) return -1;
			return Number(params) as IDRange;
		}
	}

	useEffect(() => {
		Data.getSingleFullTrackInfo(Utils.getUid() as string, id, go).then((d) => {
			setData(d);
			setRank({
				id: d.id,
				normal: d.normal,
				hardcore: d.hardcore,
			})
		});
	}, [id]);

	function gotomain(id?: IDRange) {
		if (id) {
			go("main", id)
		} else {
			go("main")
		}
	}

		return (
			<div id="edit" className="container px-5 my-5">
				<div className="mb-3">
					{data && rank ? (
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
										onChange={(e) => {
											setRank({
												...rank,
												hardcore: {
													...rank.hardcore,
													rank: e.currentTarget.value as Rank,
												},
											});
										}}
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
											Data.isValidDash(data.normal.dash) ? String(data.normal.dash) : "Error"
										}
										className="form-select"
										id="normalDash"
										onChange={(e) => {
											setRank({
												...rank,
												normal: {
													...rank.hardcore,
													dash: Number(e.currentTarget.value) as DashCount,
												},
											});
										}}
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
										onChange={(e) => {
											setRank({
												...rank,
												hardcore: {
													...rank.hardcore,
													rank: e.currentTarget.value as Rank,
												},
											});
										}}
										id="hardcoreRank"
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
											Data.isValidDash(data.normal.dash) ? String(data.normal.dash) : "Error"
										}
										className="form-select"
										onChange={(e) => {
											setRank({
												...rank,
												hardcore: {
													...rank.hardcore,
													dash: Number(e.currentTarget.value) as DashCount,
												},
											});
										}}
										id="hardcoreDash"
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
											const data = Object.entries(rank)
												.filter(([key]) => ["id", "hardcore", "normal"].includes(key))
												.reduce((obj, [key, val]) => {
													// @ts-ignore
													obj[key] = val;
													return obj;
												}, {} as RankInfo);

											Data.setUserTrackData(Utils.getUid() as string, data, id, go).then(() => {
												gotomain(id);
											});
										}}
										type="button">
										Submit
									</button>
									<button
										className="btn btn-primary editbutton"
										onClick={() => gotomain(id)}
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




