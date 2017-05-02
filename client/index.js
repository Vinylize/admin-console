import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { AppContainer } from 'react-hot-loader';
import LoadingComponent from './components/Loading/LoadingComponent';
import '../node_modules/react-mdl/extra/material';
import Root from './root';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const rootNode = document.createElement('div');
document.body.appendChild(rootNode);

const render = (Component) => {
  console.log('app rendering!');
  ReactDOM.render(
    <AppContainer >
      <MuiThemeProvider>
        <LoadingComponent />
      </MuiThemeProvider>
    </AppContainer>,
    rootNode
  );
  setTimeout(() => {
    ReactDOM.render(
      <AppContainer >
        <MuiThemeProvider>
          <Component />
        </MuiThemeProvider>
      </AppContainer>,
      rootNode
    );
  }, 2000);
};

render(Root);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./root', () => {
    render(root);
  });
}
