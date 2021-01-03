import firebase from './app';

const db = firebase.firestore();

/**
 * User representation in Firestore.
 * Includes a field 'uid' which is the Firestore document name.
 */
export class DbUser {
	constructor(dbUser = {}) {
		this.uid = dbUser.uid;
		this.username = dbUser.username;
		this.email = dbUser.email;
		this.roles = dbUser.roles;
	}
}

/**
 * Converter for using DbUser with Firebase users collection.
 */
const dbUserConverter = {
	toFirestore: dbUser => {
		return {
			username: dbUser.username,
			email: dbUser.email,
			roles: dbUser.roles,
		};
	},
	fromFirestore: (snapshot, options) => {
		const data = snapshot.data(options);
		return new DbUser({ uid: snapshot.id, ...data });
	},
};

/**
 * Attempt to create a user in Firestore.
 * 
 * @param {string} uid the user's desired uid/document name
 * @param {DbUser} dbUser the user's desired properties
 * @returns a promise to the completion
 */
export function tryDbCreateUser(uid, dbUser) {
	return db.doc(`users/${uid}`).withConverter(dbUserConverter)
		.set(dbUser);
}

/**
 * Attempt to get a user from Firestore.
 * 
 * @param {string} uid the user's uid/document name
 * @returns a promise to the returned DbUser object
 */
export function tryDbGetUser(uid) {
	return db.doc(`users/${uid}`).withConverter(dbUserConverter).get()
		.then(snapshot => snapshot.data());
}

/**
 * Attempt to get array of all users from Firestore.
 * 
 * @returns a promise to the returned DbUser array
 */
export function tryDbGetAllUsers() {
	return db.collection('users').withConverter(dbUserConverter).get()
		.then(snapshot => snapshot.docs.map(doc => doc.data()));
}

/**
 * Attempt to subscribe to a user's Firestore document,
 * invoking some callback on updates.
 * 
 * @param {string} uid the user's uid/document name
 * @param {(dbUser: DbUser) => void} callback the on snapshot callback
 * @returns the unsubscribe callback
 */
export function tryDbSubscribeUser(uid, callback) {
	return db.doc(`users/${uid}`).withConverter(dbUserConverter)
		.onSnapshot(snapshot => callback(snapshot.data()));
}
