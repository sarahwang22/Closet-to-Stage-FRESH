import React from 'react';
import { Redirect } from 'react-router-dom';

import { trySignOut } from './firebase/auth';
import * as ROUTES from '../constants/routes';

/**
 * Button to sign the current user out and return them
 * to the LANDING page.
 */
export default class SignOutButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = { status: null };
	}

	onClick = () => {
		this.setState({ status: 'Signing out...' }); // lock out the button

		trySignOut()
			.then(() => {
				// redirect on next render()
				this.setState({ status: 'SUCCESS' });
			})
			.catch(error => {
				this.setState({ status: null });
				alert(error.message);
			});
	};

	render() {
		const { status } = this.state;

		let wasClicked = false;
		let statusMsg = '';
		if (status === 'SUCCESS') { // logged out, leave
			return <Redirect to={ROUTES.LANDING} />;
		} else if (status) { // don't allow reclicks
			wasClicked = true;
			statusMsg = status;
		}

		return (
			<div>
				<button onClick={this.onClick} disabled={wasClicked}>Sign Out</button>
				<p>{statusMsg}</p>
			</div>
		);
	}
}
