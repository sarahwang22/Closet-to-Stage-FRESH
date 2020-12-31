import React from 'react';
import { Link, Redirect } from 'react-router-dom';

import { trySendPasswordReset } from './firebase/auth';
import * as ROUTES from '../constants/routes';

const PasswordForgetPage = () => (
	<div>
		<h1>Reset Password</h1>
		<PasswordForgetForm />
	</div>
);
export default PasswordForgetPage;

export const PasswordForgetLink = () => (
	<p>
		<Link to={ROUTES.PASSWORD_FORGET}>Reset Password</Link>
	</p>
);

/**
 * default form fields and status
 */
const INITIAL_STATE = {
	email: '',
	status: null,
};

class PasswordForgetForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
	}

	onSubmit = event => {
		event.preventDefault();
		this.setState({ status: 'Submitting...' }); // lock out the form in render()

		const { email } = this.state;

		trySendPasswordReset(email)
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
		const { email, status } = this.state;

		let isInvalid = false;
		let statusMsg = '';
		if (status === 'SUCCESS') { // done with the form, leave
			return <Redirect to={ROUTES.SIGN_IN} />;
		} else if (status) { // don't allow submission when status nontrivial
			isInvalid = true;
			statusMsg = status;
		} else if (email.length === 0) {
			isInvalid = true;
			statusMsg = 'Email field is required';
		}

		return (
			<form onSubmit={this.onSubmit}>
				<input
					name="email"
					value={email}
					onChange={this.onChange}
					type="text"
					placeholder="Email Address"
				/>
				<button type="submit" disabled={isInvalid}>
					Reset My Password
        		</button>
				<p>{statusMsg}</p>
			</form>
		);
	}
}
