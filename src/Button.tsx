import React from "react";
import { Link } from "react-router-dom";

export default function Button(props: {
	children: string | JSX.Element;
	id?: string;
	className?: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	href?: string;
	extras?: any;
}) {
	if (props.href !== undefined) {
		return (
			<Link to={props.href}>
				<button
					type="button"
					{...props.extras}
					id={props.id}
					onClick={props.onClick}
					className={props.className === "" ? "btn btn-primary" : `btn btn-primary ${props.className}`}>
					{props.children}
				</button>
			</Link>
		);
	} else {
		return (
			<button
				type="button"
				{...props.extras}
				id={props.id}
				onClick={props.onClick}
				className={props.className === "" ? "btn btn-primary" : `btn btn-primary ${props.className}`}>
				{props.children}
			</button>
		);
	}
}

