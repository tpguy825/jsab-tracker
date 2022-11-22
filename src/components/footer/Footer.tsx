import { Heart, Twitter, Youtube, Github, Code, Bug } from "./Icons";

/**
 * General footer for the website
 */
function Footer(props: { children?: JSX.Element | string }): JSX.Element {
	const { children } = props;
	return (
		<div className="container">
			<footer className="d-flex flex-wrap justify-content-between align-items-center py-3">
				<span className="mb-4 mb-md-0">
					Made with {Heart} by tpguy825 - <a rel="noopener" target="_blank" href="https://twitter.com/tobypayneyt">{Twitter}</a> <a rel="noopener" target="_blank" href="https://youtube.com/verydankmemes">{Youtube}</a> <a rel="noopener" target="_blank" href="https://github.com/tpguy825">{Github}</a> - <a rel="noopener" target="_blank" href="https://github.com/tpguy825/jsab-tracker">{Code} Source Code</a> - <a href="https://github.com/tpguy825/jsab-tracker">{Bug} Got a problem?</a>
				</span>
				{typeof children === "string" ? <span>{children}</span> : children}
			</footer>
		</div>
	);
}

export default Footer;

