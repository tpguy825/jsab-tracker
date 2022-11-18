/// <reference types="vite/client" />

interface DataInfo {
	/** How far down the level is on the playlist screen */
	id: number;

	/** Track name */
	name: string;

	/** Track author */
	artist: string;

	/** Track world/chapter */
	world: string;

	/** Amount of checkpoints */
	checkpoints: number;

	/** Is it a bossfight? */
	boss: boolean;

	/** Notes about the level */
	notes: string;

	/** Version added */
	added: string;

	/** Rank and dash amount for normal mode */
	normal: {
		/** Rank (S, A, B, C, blank if unknown) */
		rank: string;

		/** Dash (0 - No dash, 1 - Slow Poke, 2 - >10 dashes, 3 - Unknown) */
		dash: number;
	};

	/** Rank and dash amount for hardcore mode */
	hardcore: {
		/** Rank (S, A, B, C, blank if unknown) */
		rank: string;

		/** Dash (0 - No dash, 1 - Slow Poke, 2 - >10 dashes, 3 - Unknown) */
		dash: number;
	};
}

interface TrackInfo {
	/** How far down the level is on the playlist screen */
	id: number;

	/** Track name */
	name: string;

	/** Track author */
	artist: string;

	/** Track world/chapter */
	world: string;

	/** Amount of checkpoints */
	checkpoints: number;

	/** Is it a bossfight? */
	boss: boolean;

	/** Notes about the level */
	notes: string;

	/** Version added */
	added: string;
}

interface RankInfo {
	/** How far down the level is on the playlist screen */
	id: number;

	/** Rank and dash amount for normal mode */
	normal: {
		/** Rank (S, A, B, C, blank if unknown) */
		rank: string;

		/** Dash (0 - No dash, 1 - Slow Poke, 2 - >10 dashes, 3 - Unknown) */
		dash: number;
	};

	/** Rank and dash amount for hardcore mode */
	hardcore: {
		/** Rank (S, A, B, C, blank if unknown) */
		rank: string;

		/** Dash (0 - No dash, 1 - Slow Poke, 2 - >10 dashes, 3 - Unknown) */
		dash: number;
	};
}

interface GetDataCallback<T> {
	/** Was there an error? */
	error: boolean;

	/** Error message */
	message?: Error;

	/** Response from db */
	data?: T;
}

type GetRankDataCallback = RankInfo;
type GetTrackDataCallback = TrackInfo;
type GetAllTracksDataCallback = TrackInfo[];
type GetFullTracksDataCallback = DataInfo[];

interface AppState {
	/** Array of levels and their info */
	table: DataInfo[];

	/** JSX for the main table */
	tablejsx: JSX.Element[];
}

interface Config {
	apihost: string;
	apiport: number;
	apifull: string;
	vitehost: string;
	viteport: number;
	vitefull: string;
}

interface PartialConfig {
	apihost: string;
	apiport: number;
	vitehost: string;
	viteport: number;
}

/**
 * **Warning**: not all function names make sense. Use the JSDoc comments to help.
 */
interface Data {
	/** ```javascript
	 * // Used to wait until a user has been authenticated.
	 * // Firebase auth is async, so this is used to wait until it's done.
	 * // Usage:
	 *
	 * const user = await Data.waitForUserAuthenticated()
	 *
	 * // User has now been authenticated
	 * // `user` is of type `User`
	 * ```
	 * */
	waitForUserAuthenticated(): Promise<User>;

	/** Check if a user's path exists */
	checkIfUserExists(uid: string): Promise<boolean>;

	/** Sets the rank data for a specific song. */
	setUserTrackData(userid: string, data: RankInfo, id: number): Promise<void>;

	/** Gets full user tracks data. */
	getUserTrackData(userid: string): Promise<RankInfo[]>;

	/** Gets the info of a track for a user */
	getUserTrackInfo(userid: string, trackid: number): Promise<RankInfo>;

	/** Gets the info about a track */
	getTrackInfo(id: number): Promise<TrackInfo>;

	/** Gets all tracks */
	getAllTracksInfo(): Promise<TrackInfo[]>;

	/** Gets the full info (track data and rank data) from all tracks for a user */
	getFullTracksInfo(userid: string): Promise<DataInfo[]>;

	/** Gets the full info (track data and rank data) from a single track */
	getSingleFullTrackInfo(userid: string, trackid: number): Promise<DataInfo>;

	/** Clones the default user template for a new user */
	cloneDefaultUserTemplate(userid: string): Promise<void>;
}

/** `T` should be of type `User` from `firebase/auth` */
type LoginManager<T> = {
	user?: T;
	loggedin(): boolean;
	sendLoginRedirect(p: "github" | "google"): Promise<void>;
};

interface URLManager {
	/** Centralised method of redirecting */
	goto(url: string): void;

	/** Gets current hostname. Returns the same as `location.href` */
	gethostname(): string;

	/** Gets current query. Returns the same as `location.query` */
	getquery(): string;

	/** Reloads the page */
	reload(): void;
}

interface Utils {
	/** Gets the email of the logged in user */
	getEmail(): string | null;

	/** Gets the user id of the logged in user */
	getUid(): string | null;

	/** Logs out current user */
	logout(): void;

	/** Centralised way of setting values in LocalStorage
	 * ```javascript
	 * Utils.setLocalStorage("key", "value")
	 * // is the same as
	 * localStorage.setItem("key", "value")
	 * ``` */
	setLocalStorage(key: string, value: string): void;

	/** Centralised way of getting values from LocalStorage
	 * ```javascript
	 * Utils.getLocalStorage("key")
	 * // is the same as
	 * localStorage.getItem("key")
	 * ``` */
	getLocalStorage(key: string): string | null;
}

interface MainConfig {
	firebase: FirebaseConfig;
	analytics: AnalyticsConfig;
	footermessage?: string | JSX.Element;
}

type AnalyticsConfig = {
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

