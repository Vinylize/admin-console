import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';

import ViewerQuery from './ViewerQuery';
import AppContainer from '../components/App/AppContainer';
import FeatureContainer from '../components/Feature/FeatureContainer';
import SignupComponent from '../components/Signup/SignupComponent';
import LoginComponent from '../components/Login/LoginComponent';

import UserMainComponent from '../components/User/UserMain';
import UserListComponent from '../components/User/UserList';

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
  <Route path='/' component={AppContainer} queries={ViewerQuery}>
    <IndexRoute component={FeatureContainer} queries={ViewerQuery} />
    <Route path='/signup' component={SignupComponent} />
    <Route path='/login' component={LoginComponent} />

    <Route path='/user' component={UserMainComponent}>
      <IndexRoute component={UserListComponent} />
      <Route path='list' component={UserListComponent} />
      <Redirect from='*' to='/user' />
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

