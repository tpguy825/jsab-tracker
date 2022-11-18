import { Partytown } from "@builder.io/partytown/react";
import MainConfig from "../config/MainConfig";

const getAnalytics = (partytown: boolean, analyticsid: string) => {
	return (
		<>
			<Partytown forward={["dataLayer.push"]} />
			{/* Google tag (gtag.js) */}
			<script type={partytown ? "text/partytown" : undefined} async src={`https://www.googletagmanager.com/gtag/js?id=${analyticsid}`}></script>
			<script
				type={partytown ? "text/partytown" : undefined}
				dangerouslySetInnerHTML={{
					__html: `window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}
				
				gtag('js', new Date());
				gtag('config', '${analyticsid}');
				`,
				}}></script>
		</>
	);
};

/**
 * Extra things to be placed in the document
 */
export default function Extras() {
	return <>{MainConfig.analytics.enabled ? getAnalytics(MainConfig.analytics.partytown, MainConfig.analytics.id as string) : undefined}</>;
}
