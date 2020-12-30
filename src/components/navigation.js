import React from 'react';
import { Link } from 'react-router-dom';

import AuthUserContext from './firebase/auth';
import SignOutButton from './signout';
import * as ROUTES from '../constants/routes';

const Navigation = () => (
	<div>
		<AuthUserContext.Consumer>
			{authUser => authUser ? <NavigationAuth /> : <NavigationNonAuth />}
		</AuthUserContext.Consumer>
	</div>
);
export default Navigation;

const NavigationAuth = () => (
	<div>
		<h1>closet to stage</h1>
		<ul>
			<li>
				<Link to={ROUTES.LANDING}>Landing</Link>
			</li>
			{/* <li>
				<Link to={ROUTES.HOME}>Home</Link>
			</li>
			<li>
				<Link to={ROUTES.ACCOUNT}>Account</Link>
			</li>
			<li>
				<Link to={ROUTES.ADMIN}>Admin</Link>
			</li>
			<li>
				<Link to={ROUTES.ITEM_PAGE}>ItemPage</Link>
			</li>
			<li>
				<Link to="/itemform">ItemForm BETA</Link>
			</li> */}
			<li>
				<SignOutButton />
			</li>
		</ul>
	</div>
);

const NavigationNonAuth = () => (
	<div>
		<h1>closet to stage</h1>
		<ul>
			<li>
				<Link to={ROUTES.SIGN_IN}>Sign In</Link>
			</li>
			<li>
				<Link to={ROUTES.LANDING}>Landing</Link>
			</li>
		</ul>
	</div>
);
