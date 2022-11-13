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
	/** Initial server response */
	res: {
		/** Returned data */
		data: string;
		timeout?: NodeJS.Timer;
	};

	/** Array of levels and their info */
	table: DataInfo[];

	/** JSX for the main table */
	tablejsx: JSX.Element[];

	/** Time since the table was last updated */
	lastrefreshed: Date | string;
}

interface EditProps {
	pstate: AppState;
	psetState: React.Dispatch<React.SetStateAction<AppState>>;
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
	/** Usage:
```javascript
const user = await Data.waitForUserAuthenticated()
// `user` is of type `User`
``` */
	waitForUserAuthenticated(): Promise<User>;

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
}

interface LoginManager {
	login: any;
	loggedin(): boolean;
	sendLoginRedirect(p: "github" | "google" | "facebook"): Promise<void>;
	cloneDefaultUserTemplate(): void;
}

