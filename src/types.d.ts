/// <reference types="vite/client" />

interface DataInfo {
	/** How far down the level is on the playlist screen */
	id: IDRange;

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
		rank: Rank;

		/** Dash (0 - No dash, 1 - Slow Poke, 2 - >10 dashes, 3 - Unknown) */
		dash: DashCount;
	};

	/** Rank and dash amount for hardcore mode */
	hardcore: {
		/** Rank (S, A, B, C, blank if unknown) */
		rank: Rank;

		/** Dash (0 - No dash, 1 - Slow Poke, 2 - >10 dashes, 3 - Unknown) */
		dash: DashCount;
	};
}

type KeyArray<Index, Data> = {
	[Key in Index]: Data;
};

type IDRange = IntRange<1, 54>;

interface TrackInfo {
	/** How far down the level is on the playlist screen */
	id: IDRange;

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
	id: IDRange;

	/** Rank and dash amount for normal mode */
	normal: {
		/** Rank (S, A, B, C, blank if unknown) */
		rank: Rank;

		/** Dash (0 - No dash, 1 - Slow Poke, 2 - >10 dashes, 3 - Unknown) */
		dash: DashCount;
	};

	/** Rank and dash amount for hardcore mode */
	hardcore: {
		/** Rank (S, A, B, C, blank if unknown) */
		rank: Rank;

		/** Dash (0 - No dash, 1 - Slow Poke, 2 - >10 dashes, 3 - Unknown) */
		dash: DashCount;
	};
}

/** Dash (0 - No dash, 1 - Slow Poke, 2 - >10 dashes, 3 - Unknown) */
type DashCount = IntRange<0, 4>;

/** Rank (S, A, B, C, blank if unknown) */
type Rank = "S" | "A" | "B" | "C" | "";

interface AppState {
	/** Array of levels and their info */
	table: DataInfo[];

	/** JSX for the main table */
	tablejsx: JSX.Element[];
}

/**
 * **Warning**: not all function names make sense. Use the JSDoc comments to help.
 */
interface DataTypes {
	/** @example
	 * // Used to wait until a user has been authenticated.
	 * // Firebase auth is async, so this is used to wait until it's done.
	 * // Usage:
	 *
	 * const user = await Data.waitForUserAuthenticated()
	 *
	 * // User has now been authenticated
	 * // `user` is of type `User`
	 */
	waitForUserAuthenticated(): Promise<User>;

	/** Checks if a track ID is valid */
	isValidID(id: number): boolean;

	/** Loops over a `KeyArray` */
	keyArrayForEach<I, V>(keyarray: KeyArray<I, V>, callbackfn: (value: V, index: I) => void): void;

	/** Check if a user's path exists */
	checkIfUserExists(uid: string): Promise<boolean>;

	/** Sets the rank data for a specific song. */
	setUserTrackData(userid: string, data: RankInfo, id: IDRange): Promise<void>;

	/** Gets full user tracks data. */
	getUserTrackData(userid: string): Promise<KeyArray<string, RankInfo>>;

	/** Gets the info of a track for a user */
	getUserTrackInfo(userid: string, trackid: number): Promise<RankInfo>;

	/** Gets the info about a track */
	getTrackInfo(id: IDRange): Promise<TrackInfo>;

	/** Gets all tracks */
	getAllTracksInfo(): Promise<KeyArray<string, TrackInfo>>;

	/** Gets the full info (track data and rank data) from all tracks for a user */
	getFullTracksInfo(userid: string): Promise<KeyArray<IDRange, DataInfo>>;

	/** Gets the full info (track data and rank data) from a single track */
	getSingleFullTrackInfo(userid: string, trackid: IDRange): Promise<DataInfo>;

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

type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc["length"]]>;

/**
 * ```javascript
// Type version of
if (x <= n < y) {}
// where 
const num: IntRange<x, y> = n

// Examples:
const num: IntRange<1, 10> = 5  // ✅ works
const num: IntRange<1, 10> = 1  // ✅ works
const num: IntRange<1, 10> = 11 // ❌ error
const num: IntRange<1, 10> = 10 // ❌ error
```
 */
type IntRange<X extends number, Y extends number> = Exclude<Enumerate<Y>, Enumerate<X>>;

