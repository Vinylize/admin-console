import { firebase } from './firebase';

const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

const URL = 'http://127.0.0.1:5002/graphql';

const client = new Lokka({
  transport: new Transport(URL)
});

firebase.auth().getToken()
  .then((token) => {
    /* eslint-disable no-underscore-dangle */
    client._transport._httpOptions.headers = {
      authorization: token.accessToken,
    };
    /* eslint-enable no-underscore-dangle */
  });

export default client;
