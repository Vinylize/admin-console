import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';

import ViewerQuery from './ViewerQuery';
import AppContainer from '../components/App/AppContainer';
import FeatureContainer from '../components/Feature/FeatureContainer';
import SignupComponent from '../components/Signup/SignupComponent';
import LoginComponent from '../components/Login/LoginComponent';
import UserManagementComponent from '../components/UserManagement/UserManagementComponent';
import NodeManagementComponent from '../components/NodeManagement/NodeManagementComponent';
import OrderManagementComponent from '../components/OrderManagement/OrderManagementComponent';
import PartnerManagementComponent from '../components/PartnerManagement/PartnerManagementComponent';


export default (
  <Route path='/' component={AppContainer} queries={ViewerQuery}>
    <IndexRoute component={FeatureContainer} queries={ViewerQuery} />
    <Route path='/signup' component={SignupComponent} />
    <Route path='/login' component={LoginComponent} />
    <Route path='/usermanagement' component={UserManagementComponent} />
    <Route path='/nodemanagement' component={NodeManagementComponent} />
    <Route path='/partnermanagement' component={PartnerManagementComponent} />
    <Route path='/ordermanagement' component={OrderManagementComponent} />
    <Redirect from='*' to='/' />
  </Route>
);

