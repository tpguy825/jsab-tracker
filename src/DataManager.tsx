import { FirebaseError, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { get, ref, getDatabase, set } from "firebase/database";
import {
	getAuth,
	signInWithPopup,
	AuthProvider,
	User,
	linkWithPopup,
	GithubAuthProvider,
	GoogleAuthProvider,
	TwitterAuthProvider,
	FacebookAuthProvider,
} from "firebase/auth";
import firebaseConfig from "./FirebaseConfig";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);
const auth = getAuth(app);

export const LoginManager: LoginManager = {
	loggedin() {
		return getLocalStorage("loggedin") === "true";
	},

	login: "any",

	async sendLoginRedirect(p) {
		let provider;
		if (p === "github") {
			provider = GithubAuthProvider;
		} else if (p === "google") {
			provider = GoogleAuthProvider;
		} else if (p === "facebook") {
			provider = FacebookAuthProvider;
		} else {
			throw new Error("Unknown provider. This should never happen.");
			return;
		}

		try {
			let result = await signInWithPopup(auth, new provider() as AuthProvider);
			// let credential: OAuthCredential = provider.credentialFromResult(result) as OAuthCredential;

			console.log(getDatabase(getAuth(app).app));
			await auth.updateCurrentUser(result.user).catch((e) => {
				console.error(e);
			});

			// The signed-in user info.
			let user: User = result.user;

			console.log({ custommessage: `Welcome, ${user.displayName} [${user.email}]`, result });
			setLocalStorage("loggedin", "true");
			setLocalStorage("email", user.email as string);
			setLocalStorage("uid", user.uid);
			location.reload();
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
				linkWithPopup(auth.currentUser as User, new provider())
					.then((result) => {
						console.log({ custommessage: `Welcome, ${result.user.displayName} [${result.user.email}]`, result });
						setLocalStorage("email", result.user.email as string);
						setLocalStorage("uid", result.user.uid);
						setLocalStorage("loggedin", "true");
						location.reload();
					})
					.catch((error) => {
						errorhtml.innerText = error.message;
					});
				return;
			}

			errorhtml.innerText = errorMessage;
		}
	},

	cloneDefaultUserTemplate() {
		get(ref(db, "defaultUserTemplate")).then((snapshot) => {
			if (snapshot.exists()) {
				set(ref(db, `users/${getLocalStorage("uid")}`), snapshot.val());
			} else {
				console.error("No data available");
			}
		});
	},
};

export const Data: Data = {
	waitForUserAuthenticated() {
		return new Promise((resolve, reject) => {
			auth.onAuthStateChanged((user) => {
				if (user) {
					resolve(user);
				} else {
					reject();
				}
			}, reject);
		});
	},

	async setUserTrackData(userid, data, id) {
		await Data.waitForUserAuthenticated();
		return set(ref(db, `users/${userid}/ranks/${id}`), data);
	},

	async getUserTrackData(userid) {
		await Data.waitForUserAuthenticated();
		const snapshot = await get(ref(db, `users/${userid}/ranks`));
		if (snapshot.exists()) {
			return snapshot.val();
		} else {
			throw new Error("No data available");
		}
	},

	async getUserTrackInfo(userid, trackid) {
		await Data.waitForUserAuthenticated();
		const snapshot = await get(ref(db, `users/${userid}/ranks/${trackid}`));
		if (snapshot.exists()) {
			return snapshot.val();
		} else {
			throw new Error("No data available");
		}
	},

	async getTrackInfo(id) {
		await Data.waitForUserAuthenticated();
		const snapshot = await get(ref(db, `tracks/${id}`));

		if (snapshot.exists()) {
			return snapshot.val();
		} else {
			throw new Error("No data available");
		}
	},

	async getAllTracksInfo() {
		await Data.waitForUserAuthenticated();
		const snapshot = await get(ref(db, `tracks`));

		if (snapshot.exists()) {
			return snapshot.val();
		} else {
			throw new Error("No data available");
		}
	},

	async getFullTracksInfo(userid: string) {
		await Data.waitForUserAuthenticated();
		const trackinfo = await this.getAllTracksInfo();
		const userdataforid = await this.getUserTrackData(userid);

		let full: DataInfo[] = [];

		trackinfo.forEach((track, i) => {
			full.push({
				...track,
				...userdataforid[i + 1],
			});
		});

		return full;
	},

	async getSingleFullTrackInfo(userid: string, trackid: number) {
		await Data.waitForUserAuthenticated();
		const trackinfo = await this.getTrackInfo(trackid);
		const userdataforid = await this.getUserTrackInfo(userid, trackid-1);

		return {
			...trackinfo,
			...userdataforid,
		};
	},
};

export function getEmail() {
	return getLocalStorage("email") as string;
}

export function getUid() {
	return getLocalStorage("uid") as string;
}

export function logout() {
	setLocalStorage("email", "");
	setLocalStorage("uid", "");
	setLocalStorage("loggedin", "false");
	location.reload();
}

export function setLocalStorage(key: string, value: string) {
	return localStorage.setItem(key, value);
}

export function getLocalStorage(key: string) {
	return localStorage.getItem(key);
}

export async function cloneDefaultUserTemplate(userid: string) {
	const defaultUserTemplate = await get(ref(db, "defaultusertemplate"));
	if (defaultUserTemplate.exists()) {
		return set(ref(db, `users/${userid}`), defaultUserTemplate.val());
	} else {
		throw new Error("Failed to clone default user template. This should never happen.");
	}
}

export function getValidatedUser() {
	return new Promise((resolve, reject) => {
		const unsubscribe = auth.onAuthStateChanged(
			(user) => {
				unsubscribe();
				resolve(user);
			},
			reject // pass up any errors attaching the listener
		);
	});
}
