import React from 'react';
import { Link, Redirect } from 'react-router-dom';

import { tryAuthCreateUser } from './firebase/auth';
import { DbUser, tryDbCreateUser } from './firebase/db';

import * as ROUTES from '../constants/routes';

/**
 * Component providing the sign up form.
 */
const SignUpPage = () => (
	<div>
		<h1>Sign Up</h1>
		<SignUpForm />
	</div>
);
export default SignUpPage;

/**
 * Link to the sign up page.
 */
export const SignUpLink = () => (
	<p>
		Don't have an account?
		<br />
		<Link to={ROUTES.SIGN_UP}>Sign Up</Link>
	</p>
);

/**
 * default form fields and status
 */
const INITIAL_STATE = {
	username: '',
	email: '',
	passwordOne: '',
	passwordTwo: '',
	status: null,
}

/**
 * Component for the user sign up form.
 * Automatically signs the user in and redirects to their homepage.
 */
class SignUpForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
	}

	onSubmit = event => {
		event.preventDefault();
		this.setState({ status: 'Submitting...' }); // lock out the form in render()

		const { username, email, passwordOne } = this.state;
		const roles = {}; // TODO make additional user roles if needed

		tryAuthCreateUser(email, passwordOne)
			.then(credential => { // user signed in at this point
				// create user in Firestore
				return tryDbCreateUser(credential.user.uid, new DbUser({
					username,
					email,
					roles,
				}));
			})
			.then(() => {
				// redirect on next render()
				this.setState({ ...INITIAL_STATE, status: 'SUCCESS' });
			})
			.catch(error => {
				this.setState({ ...INITIAL_STATE });
				alert(error.message);
			});
	};

	onChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	render() {
		const {
			username,
			email,
			passwordOne,
			passwordTwo,
			status,
		} = this.state;

		let isInvalid = false;
		let statusMsg = '';
		if (status === 'SUCCESS') { // done with the form, leave
			return <Redirect to={ROUTES.HOME} />;
		} else if (status) { // don't allow submission when status nontrivial
			isInvalid = true;
			statusMsg = status;
		} else if (username.length === 0) {
			isInvalid = true;
			statusMsg = 'Username field is required';
		} else if (email.length === 0) {
			isInvalid = true;
			statusMsg = 'Email field is required';
		} else if (passwordOne.length === 0) {
			isInvalid = true;
			statusMsg = 'Password is required';
		} else if (passwordTwo !== passwordOne) {
			isInvalid = true;
			statusMsg = 'Passwords do not match';
		}

		return (
			<form onSubmit={this.onSubmit}>
				<input
					name="username"
					value={username}
					onChange={this.onChange}
					type="text"
					placeholder="username"
				/>
				<input
					name="email"
					value={email}
					onChange={this.onChange}
					type="text"
					placeholder="email"
				/>
				<input
					name="passwordOne"
					value={passwordOne}
					onChange={this.onChange}
					type="password"
					placeholder="password"
				/>
				<input
					name="passwordTwo"
					value={passwordTwo}
					onChange={this.onChange}
					type="password"
					placeholder="confirm password"
				/>
				<button type="submit" disabled={isInvalid}>Sign Up</button>
				<p>{statusMsg}</p>
			</form>
		);
	}
}
