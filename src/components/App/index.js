import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import ItemPage from '../ItemPage'
import Form from '../ItemForm'
import Filter from '../Filter'

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

import './app.css'

const App = () => (
  <Router>
    <div>
      <header>
      <div class="measurements">
          <div>
            <div class="first"></div> 
            <h5>30px(1.8rem)</h5>
          </div>
          <div>
            <div class="second"></div> 
            <h5>50px(3.1rem)</h5>
          </div>
          <div>
            <div class="third"></div> 
            <h5>100px(6.6rem)</h5>
          </div>
        </div>
        <h1>closet to stage</h1>
        <Navigation />
      </header>
      
      <hr />
      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route
        exact
        path={ROUTES.PASSWORD_FORGET}
        component={PasswordForgetPage}
      />
      <Route exact path={ROUTES.HOME} component={HomePage} />
      <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
      <Route exact path={ROUTES.ADMIN} component={AdminPage} />
      <Route exact path={ROUTES.ITEM_PAGE} component={ItemPage} />
      <Route exact path="/itemform" component = {Form} />
      <Route exact path="/filter" component = {Filter} />
    </div>
  </Router>
);

export default withAuthentication(App);