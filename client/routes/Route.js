import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';

import AppComponent from '../components/App/AppComponent';
import DashboardComponent from '../components/Dashboard/DashboardComponent';
import LoginComponent from '../components/Login/LoginComponent';

import UserMainComponent from '../components/User/UserMainComponent';
import UserListComponent from '../components/User/UserListComponent';
import UserDetailComponent from '../components/User/UserDetailComponent';

import RunnerMainComponent from '../components/Runner/RunnerMain';
import RunnerListComponent from '../components/Runner/RunnerList';
import RunnerDetailComponent from '../components/Runner/RunnerDetail';

import OrderMainComponent from '../components/Order/OrderMain';
import OrderListComponent from '../components/Order/OrderList';

import NodeMainComponent from '../components/Node/NodeMainComponent';
import NodeListComponent from '../components/Node/NodeListComponent';
import NodeDetailComponent from '../components/Node/NodeDetailComponent';

import PartnerMainComponent from '../components/Partner/PartnerMain';
import PartnerListComponent from '../components/Partner/PartnerList';

import MapContentComponent from '../components/Map/MapContent';

import { deleteAuth, checkAuthRoute } from '../auth/Auth';

export default (
  <Route path='/' component={AppComponent}>
    <IndexRoute component={DashboardComponent} onEnter={checkAuthRoute} />
    <Route path='/login' component={LoginComponent} onEnter={checkAuthRoute} />

    <Route path='/user' component={UserMainComponent} onEnter={checkAuthRoute}>
      <IndexRoute component={UserListComponent} />
      <Route path='/user/list' component={UserListComponent} />
      <Route path='/user/:id' component={UserDetailComponent} />
      <Redirect from='*' to='/user' component={UserListComponent} />
    </Route>

    <Route path='/runner' component={RunnerMainComponent} onEnter={checkAuthRoute}>
      <IndexRoute component={RunnerListComponent} />
      <Route path='/runner/list' component={RunnerListComponent} />
      <Route path='/runner/:id' component={RunnerDetailComponent} />
      <Redirect from='*' to='/runner' />
    </Route>

    <Route path='/order' component={OrderMainComponent} onEnter={checkAuthRoute}>
      <IndexRoute component={OrderListComponent} />
      <Route path='list' component={OrderListComponent} />
      <Redirect from='*' to='/order' />
    </Route>

    <Route path='/node' component={NodeMainComponent} onEnter={checkAuthRoute}>
      <IndexRoute component={NodeListComponent} />
      <Route path='/node/list' component={NodeListComponent} />
      <Route path='/node/:id' component={NodeDetailComponent} />
      <Redirect from='*' to='/node' />
    </Route>

    <Route path='/partner' component={PartnerMainComponent} onEnter={checkAuthRoute}>
      <IndexRoute component={PartnerListComponent} />
      <Route path='list' component={PartnerListComponent} />
      <Redirect from='*' to='/partner' />
    </Route>

    <Route path='/map' component={MapContentComponent} onEnter={checkAuthRoute} />
    <Route path='/logout' component={DashboardComponent} onEnter={deleteAuth} />

    {/* <Route path='/cs' component={}>
      <IndexRoute component={} />
      <Route path='/list' component={} />
    </Route>*/}


    <Redirect from='*' to='/' />
  </Route>
);
