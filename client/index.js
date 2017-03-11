import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { AppContainer } from 'react-hot-loader';
import '../node_modules/react-mdl/extra/material';

import Root from './root';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const rootNode = document.createElement('div');
document.body.appendChild(rootNode);

const render = (Component) => {
  ReactDOM.render(
    <AppContainer >
      <MuiThemeProvider>
        <Component />
      </MuiThemeProvider>
    </AppContainer>,
    rootNode
  );
};

render(Root);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./root', () => {
    render(root);
  });
}
