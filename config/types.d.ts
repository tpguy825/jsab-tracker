interface MainConfig {
	firebase: FirebaseConfig;
	analytics: AnalyticsConfig;
	footermessage?: string | JSX.Element;
}

interface AnalyticsConfig {
	/** Whether to use Google Analytics */
	enabled: boolean;

	/** Google Analytics tracking ID. `undefined` if not enabled */
	id?: string;

	/** Whether to use Partytown */
	partytown: boolean;
}

interface FirebaseConfig {
	apiKey: string;
	authDomain: string;
	projectId: string;
	storageBucket: string;
	messagingSenderId: string;
	appId: string;
	measurementId: string;
	databaseURL: string;
}
