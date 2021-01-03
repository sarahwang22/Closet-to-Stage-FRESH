import firebase from 'firebase';

import firebaseApp from './app';

const db = firebaseApp.firestore();

/////////////////
//    Users    //
/////////////////

/**
 * User representation in Firestore.
 * Includes a field 'uid' which is the Firestore user ID/document name.
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
	/**
	 * Convert a DbUser to a Firestore DocumentData.
	 * 
	 * @param {DbUser} dbUser source
	 * @returns DocumentData
	 */
	toFirestore: dbUser => {
		return {
			username: dbUser.username,
			email: dbUser.email,
			roles: dbUser.roles,
		};
	},

	/**
	 * Convert a Firestore snapshot and options to a DbUser.
	 * 
	 * @param {firebase.firestore.QueryDocumentSnapshot} snapshot the query snapshot
	 * @param {firebase.firestore.SnapshotOptions} options the get options
	 * @returns DbUser
	 */
	fromFirestore: (snapshot, options) => {
		const data = snapshot.data(options);
		return new DbUser({ ...data, uid: snapshot.id });
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
 * @returns a promise to the returned user array
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

/////////////////
//    Items    //
/////////////////

/**
 * Item representation in Firestore.
 * Includes a field 'itemid' which is the Firestore item ID/document name.
 */
export class DbItem {
	constructor(dbItem = {}) {
		this.itemid = dbItem.itemid;
		this.uid = dbItem.uid;
		this.name = dbItem.name;
		this.description = dbItem.description;
		this.size = dbItem.size;
		this.color = dbItem.color;
		this.tags = dbItem.tags;
		this.price = dbItem.price;
		this.quantity = dbItem.quantity;
		this.isListed = dbItem.isListed;
	}
}

/**
 * Converter for using DbItem with Firebase items collection.
 */
const dbItemConverter = {
	/**
	 * Convert a dbItem to a Firestore DocumentData.
	 * 
	 * @param {DbItem} dbItem source
	 * @returns DocumentData
	 */
	toFirestore: dbItem => {
		return {
			uid: dbItem.uid,
			name: dbItem.name,
			description: dbItem.description,
			size: dbItem.size,
			color: dbItem.color,
			tags: dbItem.tags,
			price: dbItem.price,
			quantity: dbItem.quantity,
			isListed: dbItem.isListed,
		};
	},

	/**
	 * Convert a Firestore snapshot and options to a DbItem.
	 * 
	 * @param {firebase.firestore.QueryDocumentSnapshot} snapshot the query snapshot
	 * @param {firebase.firestore.SnapshotOptions} options the get options
	 * @returns DbItem
	 */
	fromFirestore: (snapshot, options) => {
		const data = snapshot.data(options);
		return new DbItem({ ...data, itemid: snapshot.id });
	},
};

/**
 * Attempt to create an item in Firestore.
 * 
 * @param {string} itemid the item's desired itemid/document name
 * @param {DbItem} dbItem the item's desired properties
 * @returns a promise to the completion
 */
export function tryDbCreateItem(itemid, dbItem) {
	return db.doc(`items/${itemid}`).withConverter(dbItemConverter)
		.set(dbItem);
}

/**
 * Attempt to get an item from Firestore.
 * 
 * @param {string} itemid the item's itemid/document name
 * @returns a promise to the returned DbItem object
 */
export function tryDbGetItem(itemid) {
	return db.doc(`items/${itemid}`).withConverter(dbItemConverter).get()
		.then(snapshot => snapshot.data());
}

/**
 * Attempt to get array of items associated with a given user.
 * 
 * @param {string} uid the user's uid
 * @returns a promise to the returned item array
 */
export function tryDbGetItemsForUser(uid) {
	return db.collection('items').where('uid', '==', uid).withConverter(dbItemConverter).get()
		.then(snapshot => snapshot.docs.map(doc => doc.data()));
}
