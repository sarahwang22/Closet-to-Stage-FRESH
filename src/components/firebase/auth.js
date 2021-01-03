import React from 'react';

import firebase from './app';
import { tryDbSubscribeUser } from './db';

const auth = firebase.auth();

export class AuthState {
	constructor(authState = {}) {
		this.authUser = authState.authUser;
		this.dbRoles = authState.roles;
	}
}

/**
 * Context for the current Firebase user,
 * according to firebase.auth().onAuthStateChanged()
 * and the current Firestore user roles.
 */
const AuthUserContext = React.createContext(new AuthState());

/**
 * Register an onAuthStateChanged handler for a component, and
 * allow component to provide received value to AuthUserContext.
 * 
 * @param {React.ComponentType} Component the component to wrap
 * @returns {React.ComponentType}
 * the component subscribed to onAuthStateChanged
 * and the user's Firestore document (if applicable),
 * wrapped in AuthUserContext.Provider
 */
export function asAuthProvider(Component) {
	return class extends React.Component {
		constructor(props) {
			super(props);
			this.state = new AuthState();
		}

		componentDidMount() {
			// register handler for the authUser state
			this.unsubscribeAuth = auth.onAuthStateChanged(authUser => {
				if (authUser) {
					this.setState({ authUser });
					// if authenticated, also watch user's roles in Firestore
					this.unsubscribeRoles && this.unsubscribeRoles();
					this.unsubscribeRoles = tryDbSubscribeUser(
						authUser.uid,
						dbUser => {
							// copy new roles into dbRoles
							this.setState({ dbRoles: { ...dbUser.roles } });
						}
					);
				} else {
					this.setState(new AuthState());
					this.unsubscribeRoles && this.unsubscribeRoles();
				}
			});
		}

		componentWillUnmount() {
			this.setState(new AuthState());
			this.unsubscribeAuth && this.unsubscribeAuth();
			this.unsubscribeRoles && this.unsubscribeRoles();
		}

		render() {
			return (
				<AuthUserContext.Provider value={this.state}>
					<Component {...this.props} />
				</AuthUserContext.Provider>
			);
		}
	};
}

/**
 * Make a component require user authentication and, optionally, a set of
 * user roles before rendering; otherwise, render null.
 * 
 * @param {React.ComponentType} Component the component to wrap
 * @param {string[]} roles required user roles, if any; check if at least one matches
 * @returns {React.ComponentType} a component which renders the original Component
 * if auth check passes, and null otherwise
 */
export function withAuthProtection(Component, roles = []) {
	return (props) => (
		<AuthUserContext.Consumer>
			{authState => {
				const { authUser, dbRoles } = authState;
				// check if user authenticated
				if (!authUser) {
					return null;
				}
				// check if there are roles to meet
				if (roles.length === 0) {
					return <Component {...props} />;
				}
				// check if roles actually met
				let rolesMet = false;
				roles.forEach(role => {
					rolesMet = rolesMet || (dbRoles && dbRoles[role]);
				});
				if (rolesMet) {
					return <Component {...props} />;
				}
				// roles not met
				return null;
			}}
		</AuthUserContext.Consumer>
	);
}

/**
 * Attempt to create a new Firebase user.
 * 
 * @param {string} email the desired email
 * @param {string} password the desired password
 * @returns a promise to the returned UserCredential
 */
export function tryAuthCreateUser(email, password) {
	return auth.createUserWithEmailAndPassword(email, password);
}

/**
 * Attempt to sign in a Firebase user.
 * 
 * @param {string} email the user's email
 * @param {string} password the user's password
 * @returns a promise to the returned UserCredential
 */
export function tryAuthSignIn(email, password) {
	return auth.signInWithEmailAndPassword(email, password);
}

/**
 * Attempt to sign out a Firebase user.
 * 
 * @returns a promise to the completion
 */
export function tryAuthSignOut() {
	return auth.signOut();
}

/**
 * Attempt to send a password reset email.
 * 
 * @param {string} email the user's email
 * @returns a promise to the completion
 */
export function tryAuthSendPasswordReset(email) {
	return auth.sendPasswordResetEmail(email);
}
