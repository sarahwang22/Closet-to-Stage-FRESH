import React from 'react';
import { Link, Redirect } from 'react-router-dom';

import { tryCreateUser } from './firebase/auth';
import { dbGetUser } from './firebase/db';

import * as ROUTES from '../constants/routes';

const SignUpPage = () => (
	<div>
		<h1>Sign Up</h1>
		<SignUpForm />
	</div>
);
export default SignUpPage;

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

class SignUpForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
	}

	onSubmit = event => {
		event.preventDefault();
		this.setState({ status: 'SUBMITTING' });

		const { username, email, passwordOne } = this.state;
		const roles = []; // TODO make additional user roles if needed

		tryCreateUser(email, passwordOne)
			.then(credential => {
				return dbGetUser(credential.user.uid)
					.set({
						username,
						email,
						roles,
					}, { merge: true });
			})
			.then(() => {
				this.setState({ ...INITIAL_STATE });
				this.setState({ status: 'SUBMITTED' });
				alert('Success');
			})
			.catch(error => {
				this.setState({ ...INITIAL_STATE });
				alert(error.message);
			});
	}

	onChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	render() {
		const {
			username,
			email,
			passwordOne,
			passwordTwo,
			status
		} = this.state;

		let isInvalid = false;
		let statusMsg = '';
		if (status === 'SUBMITTED') {
			return <Redirect to={ROUTES.LANDING} />;
		} else if (status) {
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
