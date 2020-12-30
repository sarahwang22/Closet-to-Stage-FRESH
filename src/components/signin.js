import React from 'react';
import { Redirect } from 'react-router-dom';

import { trySignIn } from './firebase/auth';
import { SignUpLink } from './signup';

import * as ROUTES from '../constants/routes';

const SignInPage = () => (
	<div>
		<h1>Sign In</h1>
		<SignInForm />
		{/* <PasswordForgetLink /> */}
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
		this.setState({ status: 'SUBMITTING' });

		const { email, password } = this.state;

		trySignIn(email, password)
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
		const { email, password, status } = this.state;

		let isInvalid = false;
		let statusMsg = '';
		if(status === 'SUBMITTED') {
			return <Redirect to={ROUTES.LANDING} />;
		} else if (status) {
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
