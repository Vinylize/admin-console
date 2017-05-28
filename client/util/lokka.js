import store from './redux/redux.store';

const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

const URL = 'https://api.yetta.co/graphql';

const client = new Lokka({
  transport: new Transport(URL)
});
const clientInit = () => new Promise((resolve, reject) => {
  if (store.getState().auth.currentUser) {
    const token = store.getState().auth.token;
    /* eslint-disable no-underscore-dangle */
    client._transport._httpOptions.headers = {
      authorization: token
    };
    return resolve();
    /* eslint-enable no-underscore-dangle */
  }
  return reject('Failed to set authorization header');
});

export {
  client,
  clientInit,
};
