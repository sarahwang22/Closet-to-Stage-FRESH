import firebase from './app';

const db = firebase.firestore();

/**
 * Get the Firestore document associated with a user.
 * 
 * @param {string} uid the user's uid/document name
 */
export function dbGetUser(uid) {
	return db.doc(`users/${uid}`);
}

/**
 * Get Firestore collection for all users.
 */
export function dbGetAllUsers() {
	return db.collection('users');
}
