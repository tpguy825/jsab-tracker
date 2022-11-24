import { FirebaseError, initializeApp } from "firebase/app";
import { get, ref, getDatabase, set } from "firebase/database";
import { getAuth, signInWithPopup, AuthProvider, User, linkWithPopup, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import mainConfig from "@config/MainConfig";

// Initialize Firebase
const app = initializeApp(mainConfig.firebase);
export const db = getDatabase(app);
const auth = getAuth(app);

export const LoginManager: LoginManager<User> = {
	loggedin() {
		return Utils.getLocalStorage("loggedin") === "true";
	},

	user: undefined,

	async sendLoginRedirect(p) {
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
				this.user = result.user;
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

export const Data: DataTypes = {
	waitForUserAuthenticated() {
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

	isValidID(id) {
		return id > 0 && id < 54;
	},

	keyArrayForEach(keyarray, callbackfn) {
		for (const key in keyarray) {
			callbackfn(keyarray[key], key);
		}
	},

	async checkIfUserExists(uid) {
		let userRef = ref(db, `users/${uid}`);
		let snapshot = await get(userRef);
		return snapshot.exists();
	},

	async setUserTrackData(userid, data, id) {
		await this.waitForUserAuthenticated();
		return set(ref(db, `users/${userid}/ranks/${id}`), data);
	},

	async getUserTrackData(userid) {
		await this.waitForUserAuthenticated();
		const snapshot = await get(ref(db, `users/${userid}/ranks`));

		if (snapshot.exists()) {
			return snapshot.val();
		} else {
			this.cloneDefaultUserTemplate((LoginManager.user as User).uid);
			throw new Error("No data available");
		}
	},

	async getUserTrackInfo(userid, trackid) {
		await this.waitForUserAuthenticated();
		const snapshot = await get(ref(db, `users/${userid}/ranks/${trackid}`));
		if (snapshot.exists()) {
			return snapshot.val();
		} else {
			this.cloneDefaultUserTemplate((LoginManager.user as User).uid);
			throw new Error("No data available");
		}
	},

	async getTrackInfo(id) {
		await this.waitForUserAuthenticated();
		const snapshot = await get(ref(db, `tracks/${id}`));

		if (snapshot.exists()) {
			return snapshot.val();
		} else {
			this.cloneDefaultUserTemplate((LoginManager.user as User).uid);
			throw new Error("No data available");
		}
	},

	async getAllTracksInfo() {
		await this.waitForUserAuthenticated();
		const snapshot = await get(ref(db, `tracks`));

		if (snapshot.exists()) {
			return snapshot.val();
		} else {
			this.cloneDefaultUserTemplate((LoginManager.user as User).uid);
			throw new Error("No data available");
		}
	},

	async getFullTracksInfo(userid: string) {
		await this.waitForUserAuthenticated();
		const trackinfo = await this.getAllTracksInfo();
		const userdataforid = await this.getUserTrackData(userid);

		let full: KeyArray<IDRange, DataInfo> = {} as any;

		this.keyArrayForEach(trackinfo, (track, i) => {
			full[track.id] = {
				...track,
				...userdataforid[String(track.id-1)],
			};
		});

		return full;
	},

	async getSingleFullTrackInfo(userid: string, trackid: IDRange) {
		await this.waitForUserAuthenticated();
		const trackinfo = await this.getTrackInfo(trackid);
		const userdataforid = await this.getUserTrackInfo(userid, trackid);

		return {
			...trackinfo,
			...userdataforid,
		};
	},

	async cloneDefaultUserTemplate(userid) {
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

export const URLManager: URLManager = {
	goto(url) {
		location.href = url;
	},

	gethostname() {
		return location.hostname;
	},

	getquery() {
		return location.search;
	},

	reload() {
		return location.reload();
	},
};

/** General utilities */
export const Utils: Utils = {
	getEmail() {
		return Utils.getLocalStorage("email");
	},

	getUid() {
		return Utils.getLocalStorage("uid");
	},

	logout() {
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

	setLocalStorage(key: string, value: string) {
		return localStorage.setItem(key, value);
	},

	getLocalStorage(key: string) {
		return localStorage.getItem(key);
	},
};
