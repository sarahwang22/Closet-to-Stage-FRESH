import React from 'react';
import { trySignOut } from './firebase/auth';

const SignOutButton = () => (
	<div>
		<button onClick={() => {
			trySignOut()
				.then(() => { // user signed out at this point
					localStorage.removeItem('authUser');
				})
				.catch(error => alert(error.message));
		}}>Sign Out</button>
	</div>
);
export default SignOutButton;