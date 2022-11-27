import { Partytown } from "@builder.io/partytown/react";
import MainConfig, { AnalyticsOptions } from "@config/MainConfig";

function getAnalytics(analytics: AnalyticsOptions) {
	if (!analytics.enabled) return undefined;
	
	const { partytown, id } = analytics;
	return (
		<>
			{partytown ? <Partytown forward={["dataLayer.push"]} /> : undefined}
			{/* Google tag (gtag.js) */}
			<script type={partytown ? "text/partytown" : undefined} async src={`https://www.googletagmanager.com/gtag/js?id=${id}`}></script>
			<script
				type={partytown ? "text/partytown" : undefined}
				dangerouslySetInnerHTML={{
					__html: `window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}
				
				gtag('js', new Date());
				gtag('config', '${id}');
				`,
				}}></script>
		</>
	);
};

/**
 * Extra things to be placed in the document
 */
export default function Extras() {
	const { analytics } = MainConfig;
	return <>{getAnalytics(analytics)}</>;
}
