import React from "react";
import $ from "jquery";
import config from "./config";
import Button from "./Button";

export default class Edit extends React.Component {
	id: number;
	track: string = "";
	artist: string = "";
	rankelement?: HTMLSelectElement;
	dashelement?: HTMLSelectElement;

	constructor(props: {}) {
		super(props);
		this.id = Number(new URLSearchParams(window.location.search).get("id"));
		if (this.id < 1 || this.id > 54) {
			location.href = "/";
		}
		$.get(`http://${config.apihost}:${config.apiport}/api/track?id=${this.id}`, (data: DataInfo) => {
			this.track = data.name;
			this.artist = data.artist;
		});
	}

	componentDidMount(): void {
		let trackname = document.getElementById("trackname") as HTMLSpanElement;
		trackname.innerText = `${this.track} - ${this.artist}`;
	}

	sendedit(rank: string, dash: string) {
		$.post(
			`http://${config.apihost}:${config.apiport}/api/edit`,
			JSON.stringify({
				id: this.id,
				rank: rank,
				dash: dash,
			})
		);
	}

	render(): JSX.Element {
		return (
			<form className="form" method="post" action={`http://${config.apihost}:${config.apiport}/api/edit`}>
				<div className="input-group mb-3">
					<span id="trackname">
						{this.track} - {this.artist}
					</span>
				</div>
				<div className="rank input-group mb-3">
					<input aria-hidden="true" type="hidden" name="id" value={this.id} />
					<label className="input-group-text" htmlFor="rank">
						Rank
					</label>
					<select name="rank" className="form-select" id="rank">
						<option value="S">S</option>
						<option value="A">A</option>
						<option value="B">B</option>
						<option value="C">C</option>
					</select>
				</div>
				<div className="rank input-group mb-3">
					<label className="input-group-text" htmlFor="dash">
						Dash Count
					</label>
					<select name="dash" className="form-select" id="dash">
						<option value="0">What Dash? (No Dash)</option>
						<option value="1">Slow Poke (1-10 times)</option>
						<option value="2">{">"} 10 times</option>
					</select>
				</div>
				<div className="input-group mb-3">
					<Button type="submit">Submit</Button>
				</div>
			</form>
		);
	}
}
