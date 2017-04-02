import React from 'react';
// import Relay from 'react-relay';
import { browserHistory, Router } from 'react-router';
// import useRelay from 'react-router-relay';
import Routes from './routes/Route';

class Root extends React.Component {
  render() {
    return (
      <Router
        history={browserHistory} routes={Routes}
      />
    );
  }
}

export default Root;
