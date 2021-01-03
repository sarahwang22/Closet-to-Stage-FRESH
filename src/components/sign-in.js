import React from 'react';
import { Redirect } from 'react-router-dom';

import { tryAuthSignIn } from './firebase/auth';
import { SignUpLink } from './sign-up';
import { PasswordForgetLink } from './pw-forget';

import * as ROUTES from '../constants/routes';

const SignInPage = () => (
	<div>
		<h1>Sign In</h1>
		<SignInForm />
		<PasswordForgetLink />
		<SignUpLink />
	</div>
);
export default SignInPage;

/**
 * default form fields and status
 */
const INITIAL_STATE = {
	email: '',
	password: '',
	status: null,
}

class SignInForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
	}

	onSubmit = event => {
		event.preventDefault();
		this.setState({ status: 'Submitting...' }); // lock out the form in render()

		const { email, password } = this.state;

		tryAuthSignIn(email, password)
			.then((credential) => { // user signed in at this point
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
		const { email, password, status } = this.state;

		let isInvalid = false;
		let statusMsg = '';
		if (status === 'SUCCESS') { // done with the form, leave
			return <Redirect to={ROUTES.HOME} />;
		} else if (status) { // don't allow submission when status nontrivial
			isInvalid = true;
			statusMsg = status;
		} else if (email.length === 0) {
			isInvalid = true;
			statusMsg = 'Email field is required';
		} else if (password.length === 0) {
			isInvalid = true;
			statusMsg = 'Password field is required';
		}

		return (
			<form onSubmit={this.onSubmit}>
				<input
					name="email"
					value={email}
					type="text"
					placeholder="email"
					onChange={this.onChange} />
				<input
					name="password"
					value={password}
					type="password"
					placeholder="password"
					onChange={this.onChange} />
				<button type="submit" disabled={isInvalid}>Sign In</button>
				<p>{statusMsg}</p>
			</form>
		);
	}
}
