import React from 'react';
import { trySignOut } from './firebase/auth';

const SignOutButton = () => (
	<div>
		<button onClick={() => {
			trySignOut()
				.then(() => alert('Success'))
				.catch(error => alert(error.message));
		}}>Sign Out</button>
	</div>
);
export default SignOutButton;