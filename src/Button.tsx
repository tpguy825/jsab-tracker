import React from "react";

export default function Button(props: {
	children: string | JSX.Element;
	id?: string;
	className?: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	href?: string;
	type?: "button" | "submit" | "reset";
	extras?: any;
}) {
	return (
		<a href={props.href}>
			<button
				type={props.type}
				{...props.extras}
				id={props.id}
				onClick={props.onClick}
				className={props.className === "" ? "btn btn-primary" : `btn btn-primary ${props.className}`}>
				{props.children}
			</button>
		</a>
	);
}

