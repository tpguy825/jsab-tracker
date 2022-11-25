import { FirebaseError, initializeApp } from "firebase/app";
import { get, ref, getDatabase, set } from "firebase/database";
import { getAuth, signInWithPopup, AuthProvider, User, linkWithPopup, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import mainConfig from "@config/MainConfig";

// Initialize Firebase
const app = initializeApp(mainConfig.firebase);
export const db = getDatabase(app);
const auth = getAuth(app);

export const LoginManager = {
	loggedin(): boolean {
		return Utils.getLocalStorage("loggedin") === "true";
	},

	user: undefined as User | undefined,

	async sendLoginRedirect(p: "github" | "google"): Promise<void> {
		let provider;
		if (p === "github") {
			provider = GithubAuthProvider;
		} else if (p === "google") {
			provider = GoogleAuthProvider;
		} else {
			throw new Error("Unknown provider. This should never happen.");
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
			URLManager.goto("/main");
		} catch (e: any) {
			let error = e as FirebaseError;

			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			// The email of the user's account used.
			const email = error.customData?.email as string;
			let errorhtml = document.getElementById("error") as HTMLSpanElement;
			console.warn({ errorCode, errorMessage, email });

			if (errorCode === "popup_closed_by_user") {
				errorhtml.innerText = "Login cancelled by user";
				return;
			}

			if (errorCode === "auth/account-exists-with-different-credential") {
				try {
					const result = await linkWithPopup(auth.currentUser as User, new provider());
					console.log({ custommessage: `Welcome, ${result.user.displayName} [${result.user.email}]`, result });
					Utils.setLocalStorage("email", result.user.email as string);
					Utils.setLocalStorage("uid", result.user.uid);
					Utils.setLocalStorage("loggedin", "true");
					await Data.cloneDefaultUserTemplate(result.user.uid);
					URLManager.goto("/main");
				} catch (error: any) {
					errorhtml.innerText = error.message;
				}
				return;
			}

			errorhtml.innerText = errorMessage;
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
	 * // Usage:
	 *
	 * const user = await Data.waitForUserAuthenticated()
	 *
	 * // User has now been authenticated
	 * // `user` is of type `User`
	 */
	waitForUserAuthenticated(): Promise<User> {
		return new Promise((resolve, reject) => {
			auth.onAuthStateChanged(async (user) => {
				if (user) {
					let exists = await Data.checkIfUserExists(user.uid);
					if (!exists) {
						await Data.cloneDefaultUserTemplate(user.uid);
					}
					resolve(user);
				} else {
					if (user === null) {
						Utils.setLocalStorage("email", "");
						Utils.setLocalStorage("uid", "");
						Utils.setLocalStorage("loggedin", "false");
						URLManager.goto("/login");
					} else {
						reject(user);
					}
				}
			});
		});
	},

	/** Checks if a track ID is valid */
	isValidID(id: number): boolean {
		return id > 0 && id < 54;
	},

	isValidDash(id: number): boolean {
		return id > 0 && id < 4;
	},

	/** Loops over a `KeyArray` */
	keyArrayForEach<I, V>(keyarray: KeyArray<I, V>, callbackfn: (value: V, index: I) => void): void {
		for (const key in keyarray) {
			callbackfn(keyarray[key], key);
		}
	},

	/** Check if a user's path exists */
	async checkIfUserExists(uid: string): Promise<boolean> {
		let userRef = ref(db, `users/${uid}`);
		let snapshot = await get(userRef);
		return snapshot.exists();
	},

	/** Sets the rank data for a specific song. */
	async setUserTrackData(userid: string, data: RankInfo, id: IDRange): Promise<void> {
		await Data.waitForUserAuthenticated();
		return set(ref(db, `users/${userid}/ranks/${id}`), data);
	},

	/** Gets full user tracks data. */
	async getUserTrackData(userid: string): Promise<KeyArray<string, RankInfo>> {
		await Data.waitForUserAuthenticated();
		const snapshot = await get(ref(db, `users/${userid}/ranks`));

		if (snapshot.exists()) {
			return snapshot.val();
		} else {
			Data.cloneDefaultUserTemplate((LoginManager.user as User).uid);
			throw new Error("No data available");
		}
	},

	/** Gets the info of a track for a user */
	async getUserTrackInfo(userid: string, trackid: number): Promise<RankInfo> {
		await Data.waitForUserAuthenticated();
		const snapshot = await get(ref(db, `users/${userid}/ranks/${trackid}`));
		if (snapshot.exists()) {
			return snapshot.val();
		} else {
			Data.cloneDefaultUserTemplate((LoginManager.user as User).uid);
			throw new Error("No data available");
		}
	},

	/** Gets the info about a track */
	async getTrackInfo(id: IDRange): Promise<TrackInfo> {
		await Data.waitForUserAuthenticated();
		const snapshot = await get(ref(db, `tracks/${id}`));

		if (snapshot.exists()) {
			return snapshot.val();
		} else {
			Data.cloneDefaultUserTemplate((LoginManager.user as User).uid);
			throw new Error("No data available");
		}
	},

	/** Gets all tracks */
	async getAllTracksInfo(): Promise<KeyArray<string, TrackInfo>> {
		await Data.waitForUserAuthenticated();
		const snapshot = await get(ref(db, `tracks`));

		if (snapshot.exists()) {
			return snapshot.val();
		} else {
			Data.cloneDefaultUserTemplate((LoginManager.user as User).uid);
			throw new Error("No data available");
		}
	},

	/** Gets the full info (track data and rank data) from all tracks for a user */
	async getFullTracksInfo(userid: string): Promise<KeyArray<IDRange, DataInfo>> {
		await Data.waitForUserAuthenticated();
		const trackinfo = await Data.getAllTracksInfo();
		const userdataforid = await Data.getUserTrackData(userid);

		let full: KeyArray<IDRange, DataInfo> = {} as any;

		Data.keyArrayForEach(trackinfo, (track, i) => {
			full[track.id] = {
				...track,
				...userdataforid[String(track.id)],
			};
		});

		return full;
	},

	/** Gets the full info (track data and rank data) from a single track */
	async getSingleFullTrackInfo(userid: string, trackid: IDRange): Promise<DataInfo> {
		await Data.waitForUserAuthenticated();
		const trackinfo = await Data.getTrackInfo(trackid);
		const userdataforid = await Data.getUserTrackInfo(userid, trackid);

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
				throw new Error("Failed to get default user template. This should never happen. If it does, try refreshing the page.");
			}
		} else {
			console.debug("User data already exists, not cloning default user template");
		}
	},
};

export const URLManager = {
	/** Centralised method of redirecting */
	goto(url: string): void {
		location.href = url;
	},

	/** Gets current hostname. Returns the same as `location.href` */
	gethostname(): string {
		return location.hostname;
	},

	/** Gets current query. Returns the same as `location.query` */
	getquery(): string {
		return location.search;
	},

	/** Reloads the page */
	reload(): void {
		return location.reload();
	},
};

/** General utilities */
export const Utils = {
	getEmail(): string | null {
		return Utils.getLocalStorage("email");
	},

	getUid(): string | null {
		return Utils.getLocalStorage("uid");
	},

	logout(): void {
		if (LoginManager.user !== undefined) {
			Utils.setLocalStorage("email", "");
			Utils.setLocalStorage("uid", "");
			Utils.setLocalStorage("loggedin", "false");
			auth.signOut();
			URLManager.reload();
		} else {
			throw new Error("User is not logged in");
			URLManager.goto("/login");
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
