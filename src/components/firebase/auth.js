import React from 'react';
import { Redirect } from 'react-router-dom';

import firebase from './app';
import * as routes from '../../constants/routes';

const auth = firebase.auth();

/**
 * Context for the current Firebase user,
 * according to firebase.auth().onAuthStateChanged().
 * To avoid race conditions on auth state changes,
 * keep localStorage['authUser'] consistent with this context.
 */
const AuthUserContext = React.createContext({ authUser: null });
export default AuthUserContext;

/**
 * Register an onAuthStateChanged handler for a component, and
 * allow component to provide received value to AuthUserContext.
 * 
 * @param {React.ComponentType} Component the component to wrap
 * @returns the component subscribed to onAuthStateChanged
 * and wrapped in AuthUserContext.Provider
 */
export function withAuthProvider(Component) {
	return class extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				authUser: JSON.parse(localStorage.getItem('authUser')),
			};
		}

		componentDidMount() {
			// Upon mount, register handler to set the authUser state
			// and save it to browser local storage.
			// Additionally, save the unsubscribe callback for unmount.
			this.unsubscribe = auth.onAuthStateChanged(authUser => {
				if (authUser) {
					this.setState({ authUser });
					localStorage.setItem('authUser', JSON.stringify(authUser));
				} else {
					this.setState({ authUser: null });
					localStorage.removeItem('authUser');
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
 * user roles before rendering; otherwise, render a Redirect to SIGN_IN.
 * 
 * @param {React.ComponentType} Component the component to wrap
 * @param {string[]} roles required user roles, if any
 * @returns a component which renders the original Component if auth passes,
 * and redirects to SIGN_IN otherwise
 */
export function withAuthProtection(Component, roles = []) {
	return (props) => (
		<AuthUserContext.Consumer>
			{authUser => {
				if (authUser || localStorage.getItem('authUser')) {
					// TODO handle roles
					return <Component {...props} />;
				}
				return <Redirect to={routes.SIGN_IN} />;
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
	return firebase.auth().createUserWithEmailAndPassword(email, password);
}

/**
 * Attempt to sign in a Firebase user.
 * 
 * @param {string} email the user's email
 * @param {string} password the user's password
 */
export function trySignIn(email, password) {
	return firebase.auth().signInWithEmailAndPassword(email, password);
}

/**
 * Attempt to sign out a Firebase user.
 */
export function trySignOut() {
	return firebase.auth().signOut();
}

/**
 * Attempt to send a password reset email.
 * 
 * @param {string} email the user's email
 */
export function trySendPasswordReset(email) {
	return firebase.auth().sendPasswordResetEmail(email);
}
