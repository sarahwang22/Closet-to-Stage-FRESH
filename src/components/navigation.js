import React from 'react';
import { Link } from 'react-router-dom';

import { withAuthorization } from './firebase/auth';
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
			<Account />
			<Admin />
			<SignOut />
		</ul>
	</div>
);
export default Navigation;

const SignIn = () => <li><Link to={ROUTES.SIGN_IN}>Sign In</Link></li>;
const Home = withAuthorization(() => <li><Link to={ROUTES.HOME}>Home</Link></li>);
const Account = withAuthorization(() => <li><Link to={ROUTES.ACCOUNT}>Account</Link></li>);
const Admin = withAuthorization(() => <li><Link to={ROUTES.ADMIN}>Admin</Link></li>, [ROLES.ADMIN]);
const SignOut = withAuthorization(() => <li><SignOutButton /></li>);
