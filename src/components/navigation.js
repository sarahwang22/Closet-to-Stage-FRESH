import React from 'react';
import { Link } from 'react-router-dom';

import { withAuthProtection } from './firebase/auth';
import SignOutButton from './sign-out';
import * as ROUTES from '../constants/routes';
import * as ROLES from '../constants/roles';

/**
 * Navigation bar based on the current authentication state.
 */
const Navigation = () => (
	<div>
		<h1>closet to stage</h1>
		<ul>
			<SignIn />
			<Home />
			<Admin />
			<SignOut />
		</ul>
	</div>
);
export default Navigation;

const SignIn = () => <li><Link to={ROUTES.SIGN_IN}>Sign In</Link></li>;
const Home = withAuthProtection(() => <li><Link to={ROUTES.HOME}>Home</Link></li>);
const Admin = withAuthProtection(() => <li><Link to={ROUTES.ADMIN}>Admin</Link></li>, [ROLES.ADMIN]);
const SignOut = withAuthProtection(() => <li><SignOutButton /></li>);
