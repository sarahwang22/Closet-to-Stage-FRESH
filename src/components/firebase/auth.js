import React from 'react';

import firebase from './app';

const auth = firebase.auth();

const INITIAL_STATE = {
	authUser: null,
};

/**
 * Context for the current Firebase user,
 * according to firebase.auth().onAuthStateChanged().
 */
const AuthUserContext = React.createContext({ ...INITIAL_STATE });
export default AuthUserContext;

/**
 * Register an onAuthStateChanged handler for a component, and
 * allow component to provide received value to AuthUserContext.
 * 
 * @param {React.ComponentType} Component the component to wrap
 * @returns the component subscribed to onAuthStateChanged
 * and wrapped in AuthUserContext.Provider
 */
export function asAuthProvider(Component) {
	return class extends React.Component {
		constructor(props) {
			super(props);
			this.state = { ...INITIAL_STATE };
		}

		componentDidMount() {
			// Upon mount, register handler to set the authUser state
			// and save it to browser local storage.
			// Additionally, save the unsubscribe callback for unmount.
			this.unsubscribe = auth.onAuthStateChanged(authUser => {
				if (authUser) {
					this.setState({ authUser });
				} else {
					this.setState({ authUser: null });
				}
			});
		}

		componentWillUnmount() {
			this.unsubscribe();
		}

		render() {
			return (
				<AuthUserContext.Provider value={this.state.authUser}>
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
 * @param {string[]} roles required user roles, if any
 * @returns a component which renders the original Component if auth check
 * passes, and null otherwise
 */
export function withAuthProtection(Component, roles = []) {
	return (props) => (
		<AuthUserContext.Consumer>
			{authUser => {
				if (authUser) { // first check user authenticated
					return <Component {...props} />;
				}
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
 */
export function tryCreateUser(email, password) {
	return auth.createUserWithEmailAndPassword(email, password);
}

/**
 * Attempt to sign in a Firebase user.
 * 
 * @param {string} email the user's email
 * @param {string} password the user's password
 */
export function trySignIn(email, password) {
	return auth.signInWithEmailAndPassword(email, password);
}

/**
 * Attempt to sign out a Firebase user.
 */
export function trySignOut() {
	return auth.signOut();
}

/**
 * Attempt to send a password reset email.
 * 
 * @param {string} email the user's email
 */
export function trySendPasswordReset(email) {
	return auth.sendPasswordResetEmail(email);
}
