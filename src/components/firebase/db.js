import firebase from './app';

const db = firebase.firestore();

export function dbGetUser(uid) {
	return db.doc(`users/${uid}`);
}

export function dbGetAllUsers() {
	return db.collection('users');
}
