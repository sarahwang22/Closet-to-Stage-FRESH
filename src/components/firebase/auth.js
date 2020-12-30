import React from 'react';
import { Redirect } from 'react-router-dom';

import firebase from './app';
import * as routes from '../../constants/routes';

const auth = firebase.auth();

const AuthUserContext = React.createContext({ authUser: null });
export default AuthUserContext;

export function withAuthProvider(Component) {
	return class extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				authUser: null,
			};
		}

		componentDidMount() {
			this.unsubscribe = auth.onAuthStateChanged(authUser => {
				this.setState({ authUser });
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

export function withAuthProtection(Component, roles = []) {
	return (props) => (
		<AuthUserContext.Consumer>
			{authUser => {
				if (authUser) {
					// TODO handle roles
					return <Component {...props} />;
				}
				return <Redirect to={routes.SIGN_IN} />;
			}}
		</AuthUserContext.Consumer>
	);
}

export function tryCreateUser(email, password) {
	return firebase.auth().createUserWithEmailAndPassword(email, password);
}

export function trySignIn(email, password) {
	return firebase.auth().signInWithEmailAndPassword(email, password);
}

export function trySignOut() {
	return firebase.auth().signOut();
}

export function tryPasswordReset(email) {
	return firebase.auth().sendPasswordResetEmail(email);
}
