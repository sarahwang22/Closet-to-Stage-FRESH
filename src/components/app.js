import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from './navigation';
import LandingPage from './landing';
import { withAuthProvider } from './firebase/auth';
import SignUpPage from './signup';
import SignInPage from './signin';
// import PasswordForgetPage from '../PasswordForget';
// import HomePage from '../Home';
// import AccountPage from '../Account';
// import AdminPage from '../Admin';
// import ItemPage from '../ItemPage'
// import Form from '../ItemForm'

import * as ROUTES from '../constants/routes';

/**
 * Router for the entire website.
 * Must be passed to withAuthProvider for privileged pages.
 */
const App = () => (
	<Router>
		<div>
			<Navigation />
			<hr />
			<Route exact path={ROUTES.LANDING} component={LandingPage} />
			<Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
			<Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
			{/* <Route exact path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} /> */}
			{/* <Route exact path={ROUTES.HOME} component={HomePage} /> */}
			{/* <Route exact path={ROUTES.ACCOUNT} component={AccountPage} /> */}
			{/* <Route exact path={ROUTES.ADMIN} component={AdminPage} /> */}
			{/* <Route exact path={ROUTES.ITEM_PAGE} component={ItemPage} /> */}
			{/* <Route exact path="/itemform" component={Form} /> */}
		</div>
	</Router>
);
export default withAuthProvider(App);
