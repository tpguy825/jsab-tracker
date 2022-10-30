import { useState } from "react";

export default function App() {
	const [state, setState] = useState({ res: "No Response", table: [], tablejsx: [<></>] });

	fetch("http://localhost:3000/")
		.then((res) => res.text())
		.then((res) => setState({ res: res, table: state.table, tablejsx: state.tablejsx }));

	const getTable = async () => {
		await fetch("http://localhost:3000/api/get")
			.then((res) => res.json())
			.then((data) => setState({ res: state.res, table: data, tablejsx: state.tablejsx }));
		state.table.forEach((row) => {
			state.tablejsx.push(
				<tr>
					<th scope="row">{row.id}</th>
					<td>Mark</td>
					<td>Otto</td>
					<td>@mdo</td>
				</tr>
			);
		});
	};

	return (
		<div className="container">
			<span>Server response: {state.res}</span>
			<table className="table">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">First</th>
						<th scope="col">Last</th>
						<th scope="col">Handle</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">1</th>
						<td>Mark</td>
						<td>Otto</td>
						<td>@mdo</td>
					</tr>
					<tr>
						<th scope="row">2</th>
						<td>Jacob</td>
						<td>Thornton</td>
						<td>@fat</td>
					</tr>
					<tr>
						<th scope="row">3</th>
						<td>Larry the Bird</td>
						<td>@twitter</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

