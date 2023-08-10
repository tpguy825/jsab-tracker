import type { FirebaseOptions } from "firebase/app";
import type { JSX } from "preact/jsx-runtime";

const config: MainConfig = {
	firebase: {
		apiKey: "AIzaSyCYPrNNy-UFuNsC5VFd2pEiedJU2IOEf3c",
		authDomain: "jsab-tracker.firebaseapp.com",
		projectId: "jsab-tracker",
		storageBucket: "jsab-tracker.appspot.com",
		messagingSenderId: "805765363904",
		appId: "1:805765363904:web:ce42f2aa02afa80cd51525",
		measurementId: "G-6JDPXJC0T6",
		databaseURL: "https://jsab-tracker-default-rtdb.europe-west1.firebasedatabase.app",
	},
	analytics: {
		enabled: true,
		id: "G-6JDPXJC0T6",
		partytown: true,
	},
	footermessage: "If you encounter any issues, try refreshing the page.",
}
export const { firebase, analytics, footermessage } = config;

// types
interface MainConfig {
	firebase: FirebaseOptions;
	analytics: AnalyticsOptions;
	footermessage?: string | JSX.Element;
}

export type AnalyticsOptions = {
			/** Whether to use Google Analytics */
			enabled: true;
			
			/** Google Analytics tracking ID. */
			id: string;
			
			/** Whether to use Partytown */
			partytown: boolean;
		} | {
			/** Whether to use Google Analytics */
			enabled: false;
	  };
