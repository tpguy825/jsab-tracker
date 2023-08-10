import { FirebaseError, initializeApp } from "firebase/app";
import { get, ref, getDatabase, set } from "firebase/database";
import {
	getAuth,
	signInWithPopup,
	type AuthProvider,
	type User,
	linkWithPopup,
	GithubAuthProvider,
	GoogleAuthProvider,
} from "firebase/auth";
import { firebase } from "./config";
import type { Go } from "./main";

// Initialize Firebase
const app = initializeApp(firebase);
export const db = getDatabase(app);
const auth = getAuth(app);

export const LoginManager = {
	loggedin(): boolean {
		return auth.currentUser !== null && Utils.getLocalStorage("loggedin") === "true";
	},

	user: null as User | null,

	async sendLoginRedirect(
		p: "github" | "google",
		go: Go,
	): Promise<
		| {
				success: true;
		  }
		| {
				success: false;
				error: string;
		  }
	> {
		let provider: typeof GithubAuthProvider | typeof GoogleAuthProvider;
		if (p === "github") {
			provider = GithubAuthProvider;
		} else if (p === "google") {
			provider = GoogleAuthProvider;
		} else {
			return { success: false, error: "Unknown provider. This should never happen." };
		}

		try {
			let result = await signInWithPopup(auth, new provider() as AuthProvider);
			// let credential: OAuthCredential = provider.credentialFromResult(result) as OAuthCredential;
			await auth.updateCurrentUser(result.user).then(() => {
				LoginManager.user = result.user;
			});

			// The signed-in user info.
			let user = result.user;

			console.log(`Welcome, ${user.displayName} [${user.email}]`);
			Utils.setLocalStorage("loggedin", "true");
			Utils.setLocalStorage("email", user.email as string);
			Utils.setLocalStorage("uid", user.uid);
			await Data.cloneDefaultUserTemplate(user.uid);
			go("main");
			return { success: true };
		} catch (e: any) {
			let error = e as FirebaseError;

			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			console.warn({ errorCode, errorMessage });

			if (errorCode === "popup_closed_by_user") {
				return { success: false, error: "Login cancelled by user" };
			}

			if (errorCode === "auth/account-exists-with-different-credential") {
				try {
					const result = await linkWithPopup(auth.currentUser!, new provider());
					console.log({
						custommessage: `Welcome, ${result.user.displayName} [${result.user.email}]`,
						result,
					});
					LoginManager.user = result.user;
					Utils.setLocalStorage("email", result.user.email as string);
					Utils.setLocalStorage("uid", result.user.uid);
					Utils.setLocalStorage("loggedin", "true");
					await Data.cloneDefaultUserTemplate(result.user.uid);
					go("main");
					return { success: true };
				} catch (error: any) {
					return { success: false, error: error.message };
				}
			}

			return { success: false, error: errorMessage };
		}
	},
};

/**
 * **Warning**: not all function names make sense. Use the JSDoc comments to help.
 */
export const Data = {
	/** @example
	 * // Used to wait until a user has been authenticated.
	 * // Firebase auth is async, so this is used to wait until it's done.
	 * // This is blocking when awaited, so use wisely.
	 * // Usage:
	 *
	 * const user = await Data.waitForUserAuthenticated()
	 *
	 * // User has now been authenticated
	 * // `user` is of type `User`
	 */
	waitForUserAuthenticated(go: Go): BetterPromise<User, Error> {
		return promise(async (resolve, reject) => {
			try {
				auth.onAuthStateChanged(async (user) => {
					if (user) {
						let exists = await Data.checkIfUserExists(user.uid);
						if (!exists) {
							await Data.cloneDefaultUserTemplate(user.uid).catch(reject);
						}
						resolve(user);
					} else {
						Utils.setLocalStorage("email", "");
						Utils.setLocalStorage("uid", "");
						Utils.setLocalStorage("loggedin", "false");
						go("login");
					}
				});
			} catch (e) {
				reject(e as Error);
			}
		});
	},

	/** Checks if a track ID is valid */
	isValidID(id: number): id is IDRange {
		return id > 0 && id < 54;
	},

	isValidDash(id: number): id is 0 | 1 | 2 | 3 {
		return Number.isInteger(id) && id > -1 && id < 4;
	},

	/** Loops over a `Record` */
	recordForEach<I extends string | number | symbol, V>(keyarray: Record<I, V>): [I, V][] {
		return Object.entries(keyarray) as [I, V][];
	},

	/** Check if a user's path exists */
	async checkIfUserExists(uid: string): Promise<boolean> {
		let userRef = ref(db, `users/${uid}`);
		let snapshot = await get(userRef);
		return snapshot.exists();
	},

	/** Sets the rank data for a specific song. */
	async setUserTrackData(userid: string, data: RankInfo, id: IDRange, go: Go): Promise<void> {
		await Data.waitForUserAuthenticated(go);
		return set(ref(db, `users/${userid}/ranks/${id}`), data);
	},

	/** Gets full user tracks data. */
	async getUserTrackData(userid: string, go: Go): Promise<Record<string, RankInfo>> {
		await Data.waitForUserAuthenticated(go);
		const snapshot = await get(ref(db, `users/${userid}/ranks`));

		if (snapshot.exists()) {
			return snapshot.val();
		} else {
			Data.cloneDefaultUserTemplate((LoginManager.user as User).uid);
			throw new Error("No data available");
		}
	},

	/** Gets the info of a track for a user */
	async getUserTrackInfo(userid: string, trackid: number, go: Go): Promise<RankInfo> {
		await Data.waitForUserAuthenticated(go);
		const snapshot = await get(ref(db, `users/${userid}/ranks/${trackid}`));
		if (snapshot.exists()) {
			return snapshot.val();
		} else {
			Data.cloneDefaultUserTemplate((LoginManager.user as User).uid);
			throw new Error("No data available");
		}
	},

	/** Gets the info about a track */
	async getTrackInfo(id: IDRange, go: Go): Promise<TrackInfo> {
		await Data.waitForUserAuthenticated(go);
		const snapshot = await get(ref(db, `tracks/${id}`));

		if (snapshot.exists()) {
			return snapshot.val();
		} else {
			Data.cloneDefaultUserTemplate((LoginManager.user as User).uid);
			throw new Error("No data available");
		}
	},

	/** Gets all tracks */
	async getAllTracksInfo(go: Go): Promise<Record<string, TrackInfo>> {
		await Data.waitForUserAuthenticated(go);
		const snapshot = await get(ref(db, `tracks`));

		if (snapshot.exists()) {
			return snapshot.val();
		} else {
			Data.cloneDefaultUserTemplate((LoginManager.user as User).uid);
			throw new Error("No data available");
		}
	},

	/** Gets the full info (track data and rank data) from all tracks for a user */
	async getFullTracksInfo(userid: string, go: Go): Promise<Record<IDRange, DataInfo>> {
		await Data.waitForUserAuthenticated(go);
		const trackinfo = await Data.getAllTracksInfo(go);
		const userdataforid = await Data.getUserTrackData(userid, go);

		let full: Record<IDRange, DataInfo> = {} as any;

		Data.recordForEach(trackinfo).forEach(([_, track]) => {
			full[track.id] = {
				...track,
				...userdataforid[String(track.id)],
			};
		});

		return full;
	},

	/** Gets the full info (track data and rank data) from a single track */
	async getSingleFullTrackInfo(userid: string, trackid: IDRange, go: Go): Promise<DataInfo> {
		await Data.waitForUserAuthenticated(go);
		const trackinfo = await Data.getTrackInfo(trackid, go);
		const userdataforid = await Data.getUserTrackInfo(userid, trackid, go);

		return {
			...trackinfo,
			...userdataforid,
		};
	},

	/** Clones the default user template for a new user */
	async cloneDefaultUserTemplate(userid: string): Promise<void> {
		const userdata = await get(ref(db, `users/${userid}`));
		if (!userdata.exists()) {
			const defaultUserTemplate = await get(ref(db, "defaultusertemplate"));
			if (defaultUserTemplate.exists()) {
				return set(ref(db, `users/${userid}`), defaultUserTemplate.val());
			} else {
				throw new Error(
					"Failed to get default user template. This should never happen. If it does, try refreshing the page.",
				);
			}
		} else {
			console.debug("User data already exists, not cloning default user template");
		}
	},
};

export const URLManager = {
	/** Gets current hostname. Returns the same as `location.href` */
	gethostname(): string {
		return location.hostname;
	},

	/** Gets current query. Returns the same as `location.query` */
	getquery(): string {
		return location.search;
	},
};

/** General utilities */
export const Utils = {
	getEmail(): string | null {
		return LoginManager.user?.email || Utils.getLocalStorage("email");
	},

	getUid(): string | null {
		return LoginManager.user?.uid || Utils.getLocalStorage("uid");
	},

	logout(go: Go): void {
		if (LoginManager.user) {
			LoginManager.user = null;
			Utils.setLocalStorage("email", "");
			Utils.setLocalStorage("uid", "");
			Utils.setLocalStorage("loggedin", "false");
			auth.signOut();
			go("login");
		} else {
			console.warn("User is not logged in");
			go("login");
		}
	},
	
	/** Centralised way of setting values in LocalStorage
	 * @example
	 * Utils.setLocalStorage("key", "value")
	 * // is the same as
	 * localStorage.setItem("key", "value")
	 */
	setLocalStorage(key: string, value: string): void {
		return localStorage.setItem(key, value);
	},

	/** Centralised way of getting values from LocalStorage
	 * @example
	 * Utils.getLocalStorage("key")
	 * // is the same as
	 * localStorage.getItem("key")
	 */
	getLocalStorage(key: string): string | null {
		return localStorage.getItem(key);
	},

	numberToString(num: number): string {
		return String(num);
	},
};

function promise<Resolve, Reject>(
	cb: (resolve: (value: Resolve) => void, reject: (reason?: Reject) => void) => void,
): BetterPromise<Resolve, Reject> {
	return new Promise(cb) as BetterPromise<Resolve, Reject>;
}

type BetterPromise<Resolve, Reject> = Promise<Resolve> & {
	then<NextResolve, NextReject>(
		onfulfilled?: ((value: Resolve) => NextResolve | BetterPromiseLike<NextResolve, NextReject>) | null,
		onrejected?: ((reason: Reject) => NextReject | BetterPromiseLike<NextReject, unknown>) | null,
	): BetterPromise<NextResolve, NextReject>;
	catch<NextReject>(
		onrejected?: (reason: Reject) => NextReject | BetterPromiseLike<Resolve, NextReject>,
	): BetterPromise<Resolve, NextReject>;
};
type BetterPromiseLike<Resolve, Reject> = Pick<BetterPromise<Resolve, Reject>, "then">;
