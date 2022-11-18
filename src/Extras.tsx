import { Partytown } from "@builder.io/partytown/react";

/**
 * Extra things to be placed in the document
 */
export default function Extras() {
	return (
		<>
			<Partytown forward={["dataLayer.push"]} />
			{/* Google tag (gtag.js) */}
			<script type="text/partytown" async src="https://www.googletagmanager.com/gtag/js?id=G-6JDPXJC0T6"></script>
			<script
				type="text/partytown"
				dangerouslySetInnerHTML={{
					__html: `window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					
					gtag('js', new Date());
					gtag('config', 'G-6JDPXJC0T6');
					`,
				}}></script>
		</>
	);
}
