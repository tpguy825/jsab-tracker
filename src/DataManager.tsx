import { FirebaseError, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { get, ref, getDatabase, set } from "firebase/database";
import {
	getAuth,
	signInWithPopup,
	GithubAuthProvider,
	OAuthCredential,
	GoogleAuthProvider,
	AuthProvider,
	User,
	UserCredential,
	linkWithPopup,
} from "firebase/auth";
import firebaseConfig from "./FirebaseConfig";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);

export const LoginManager: LoginManager = {
	loggedin() {
		return getLocalStorage("loggedin") === "true";
	},

	async sendLoginRedirect(p: "github" | "google" | "email") {
		let provider, oauth;
		if (p === "github") {
			provider = GithubAuthProvider;
			oauth = true;
		} else if (p === "google") {
			provider = GoogleAuthProvider;
			oauth = true;
		} else {
			throw new Error("Unknown provider. This should never happen.");
			return;
		}
		const auth = getAuth(app);
		try {
			let result = await signInWithPopup(auth, new provider() as AuthProvider);
			let credential: OAuthCredential = provider.credentialFromResult(result) as OAuthCredential;

			// The signed-in user info.
			let user: User = result.user;
			// This gives you a GitHub Access Token. You can use it to access the GitHub API.

			console.log({ custommessage: `Welcome, ${user.displayName} [${user.email}]`, result });
			setLocalStorage("loggedin", "true");
			setLocalStorage("email", user.email as string);
			setLocalStorage("uid", user.uid);
			// location.reload();
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

			errorhtml.innerText = `Error: ${errorMessage}`;
		}
	},

	async sendSignupRedirect(p) {
		let provider;
		if (p === "github") {
			provider = GithubAuthProvider;
		} else if (p === "google") {
			provider = GoogleAuthProvider;
		} else {
			throw new Error("Unknown provider. This should never happen.");
			return;
		}
		const auth = getAuth(app);
		try {
			let credential: OAuthCredential | UserCredential;
			let result = await signInWithPopup(auth, new provider());
			credential = provider.credentialFromResult(result) as OAuthCredential;
			console.log({ custommessage: `Welcome, ${result.user.displayName} [${result.user.email}]`, credential, result });

			setLocalStorage("loggedin", "true");
			setLocalStorage("email", result.user.email as string);
			location.reload();
		} catch (e: any) {
			let error = e as FirebaseError;

			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			// The email of the user's account used.
			const email = error.customData?.email as string;
			let errorhtml = document.getElementById("error") as HTMLSpanElement;

			if (errorCode === "popup_closed_by_user") {
				errorhtml.innerText = "Login cancelled by user";
				return;
			}

			if (errorCode === "auth/argument-error") {
				errorhtml.innerText = "Hmm... Something went wrong. Double-check your email and password.";
			}

			if (errorCode === "auth/account-exists-with-different-credential") {
				linkWithPopup(auth.currentUser as User, new provider()).catch((error) => {
					errorhtml.innerText = error.message;
				});
			}
		}
	},
};

export const Data: Data = {
	async setUserTrackData(userid, data, id) {
		return set(ref(db, `users/${userid}/ranks/${id}`), data);
	},

	async getUserTrackData(userid) {
		const snapshot = await get(ref(db, `users/${userid}/ranks`));
		if (snapshot.exists()) {
			return snapshot.val();
		} else {
			throw new Error("No data available");
		}
	},

	async getUserTrackInfo(userid, trackid) {
		const snapshot = await get(ref(db, `users/${userid}/ranks/${trackid}`));
		if (snapshot.exists()) {
			return snapshot.val();
		} else {
			throw new Error("No data available");
		}
	},

	async getTrackInfo(id) {
		const snapshot = await get(ref(db, `tracks/${id}`));

		if (snapshot.exists()) {
			return snapshot.val();
		} else {
			throw new Error("No data available");
		}
	},

	async getAllTracksInfo() {
		const snapshot = await get(ref(db, `tracks`));

		if (snapshot.exists()) {
			return snapshot.val();
		} else {
			throw new Error("No data available");
		}
	},

	async getFullTracksInfo(userid: string) {
		const trackinfo = await this.getAllTracksInfo();
		const userdataforid = await this.getUserTrackData(userid);

		let full: DataInfo[] = [];

		trackinfo.forEach((track, i) => {
			full.push({
				...track,
				...userdataforid[i+1],
			});
		});

		return full;
	},

	async getSingleFullTrackInfo(userid: string, trackid: number) {
		const trackinfo = await this.getTrackInfo(trackid);
		const userdataforid = await this.getUserTrackInfo(userid, trackid);

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
