import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from './navigation';
import LandingPage from './landing';
import { asAuthProvider } from './firebase/auth';
import SignUpPage from './sign-up';
import SignInPage from './sign-in';
import PasswordForgetPage from './pw-forget';
import HomePage from './home';
import AccountPage from './account';
import AdminPage from './admin';
// import ItemPage from '../ItemPage'
// import Form from '../ItemForm'

import * as ROUTES from '../constants/routes';

/**
 * Router wrapper and auth context provider.
 */
const App = () => (
	<Router>
		<div>
			<Navigation />
			<hr />
			<Route exact path={ROUTES.LANDING} component={LandingPage} />
			<Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
			<Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
			<Route exact path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
			<Route exact path={ROUTES.HOME} component={HomePage} />
			<Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
			<Route exact path={ROUTES.ADMIN} component={AdminPage} />
			{/* <Route exact path={ROUTES.ITEM_PAGE} component={ItemPage} /> */}
			{/* <Route exact path="/itemform" component={Form} /> */}
		</div>
	</Router>
);
export default asAuthProvider(App);
