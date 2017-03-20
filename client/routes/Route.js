import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';

import AppComponent from '../components/App/AppComponent';
import DashboardComponent from '../components/Dashboard/DashboardComponent';
import SignupComponent from '../components/Signup/SignupComponent';
import LoginComponent from '../components/Login/LoginComponent';

import UserMainComponent from '../components/User/UserMainComponent';
import UserListComponent from '../components/User/UserListComponent';
import UserDetailComponent from '../components/User/UserDetailComponent';

import RunnerMainComponent from '../components/Runner/RunnerMain';
import RunnerListComponent from '../components/Runner/RunnerList';

import OrderMainComponent from '../components/Order/OrderMain';
import OrderListComponent from '../components/Order/OrderList';

import NodeMainComponent from '../components/Node/NodeMain';
import NodeListComponent from '../components/Node/NodeList';

import PartnerMainComponent from '../components/Partner/PartnerMain';
import PartnerListComponent from '../components/Partner/PartnerList';

import MapContentComponent from '../components/Map/MapContent';

export default (
  <Route path='/' component={AppComponent}>
    <IndexRoute component={DashboardComponent} />
    <Route path='/signup' component={SignupComponent} />
    <Route path='/login' component={LoginComponent} />

    <Route path='/user' component={UserMainComponent}>
      <IndexRoute component={UserListComponent} />
      <Route path='/user/list' component={UserListComponent} />
      <Route path='/user/:id' component={UserDetailComponent} />
      <Redirect from='*' to='/user' component={UserListComponent} />
    </Route>

    <Route path='/runner' component={RunnerMainComponent}>
      <IndexRoute component={RunnerListComponent} />
      <Route path='list' component={RunnerListComponent} />
      <Redirect from='*' to='/runner' />
    </Route>

    <Route path='/order' component={OrderMainComponent}>
      <IndexRoute component={OrderListComponent} />
      <Route path='list' component={OrderListComponent} />
      <Redirect from='*' to='/order' />
    </Route>

    <Route path='/node' component={NodeMainComponent}>
      <IndexRoute component={NodeListComponent} />
      <Route path='list' component={NodeListComponent} />
      <Redirect from='*' to='/node' />
    </Route>

    <Route path='/partner' component={PartnerMainComponent}>
      <IndexRoute component={PartnerListComponent} />
      <Route path='list' component={PartnerListComponent} />
      <Redirect from='*' to='/partner' />
    </Route>

    <Route path='/map' component={MapContentComponent} />

    {/* <Route path='/cs' component={}>
      <IndexRoute component={} />
      <Route path='/list' component={} />
    </Route>*/}


    <Redirect from='*' to='/' />
  </Route>
);

