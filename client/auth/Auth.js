import firebase from 'firebase';
import { client } from '../util/lokka';
import store from '../util/redux/redux.store';
import { saveAuth, destroyAuth } from '../util/redux/actions/auth.actions';

const uploadBaseUrl = 'https://api.yetta.co/graphql?query=';

const checkAuth = () => {
  const currentUser = store.getState().auth.currentUser;
  // refresh auth
  if (currentUser && currentUser.exp > (Math.floor(Date.now() / 1000))) {
    const token = store.getState().auth.token;
    const url = `${uploadBaseUrl}mutation{adminRefreshAuth(input:{token:"${token}"}){user{e,n,permission,exp} token}}`;
    fetch(url, {
      method: 'POST',
      headers: {
        authorization: token,
        permission: 'admin'
      }
    })
    .then(response => response.json())
    .then((response) => {
      if (response.errors) {
        if (response.errors[0].message === 'jwt expired') {
          store.dispatch(destroyAuth());
        }
        return false;
      }
      const newUser = response.data.adminRefreshAuth.user;
      const newToken = response.data.adminRefreshAuth.token;
      store.dispatch(saveAuth({ user: newUser, token: newToken }));
      /* eslint-disable no-underscore-dangle */
      client._transport._httpOptions.headers = {
        authorization: newToken,
      };
      /* eslint-enable no-underscore-dangle */
      return true;
    });
    return currentUser;
  }
  return false;
};

const checkAuthRoute = (nextState, transition) => {
  if (!checkAuth()) {
    if (nextState.location.pathname.toLocaleLowerCase() !== '/login') {
      transition({
        pathname: '/login',
        state: nextState.location.pathname
      });
    }
  } else if (nextState.location.pathname.toLocaleLowerCase() === '/login') {
    transition({
      pathname: '/'
    });
  }
};

const getAuth = (email, password) => new Promise((resolve, reject) => {
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((err) => {
    if (err) console.log(err);
    const url = `${uploadBaseUrl}mutation{adminSignIn(input:{e:"${email}",pw:"${password}"}){user{e,n,permission,exp} token}}`;
    return fetch(url, {
      method: 'POST',
    })
    .then(response => response.json())
    .then((response) => {
      if (response.errors) {
        alert(response.errors[0].message);
        return;
      }
      const user = response.data.adminSignIn.user;
      const token = response.data.adminSignIn.token;
      store.dispatch(saveAuth({ user, token }));
      /* eslint-disable no-underscore-dangle */
      client._transport._httpOptions.headers = {
        authorization: token,
        permission: 'admin'
      };
      /* eslint-enable no-underscore-dangle */
      resolve();
    })
    .catch(error => reject(error));
  });
});

const deleteAuth = (nextState, transition) => {
  if (!checkAuth()) {
    alert('Login first!');
    transition('/');
  } else {
    firebase.auth().signOut()
    .then(() => {
      const token = store.getState().auth.token;
      const url = `${uploadBaseUrl}mutation{adminSignOut(input:{token:"${token}"}){result}}`;
      store.dispatch(destroyAuth());
      transition('/login');
      fetch(url, {
        method: 'POST',
        headers: {
          authorization: token
        }
      })
      .then(response => response.json())
      .then((response) => {
        if (response.errors) {
          if (response.errors[0].message === 'jwt expired') {
            store.dispatch(destroyAuth());
            return;
          }
          alert(response.errors[0].message);
        }
      })
      .catch((error) => {
        transition('/');
        return alert(error);
      });
    });
  }
};

export {
  getAuth,
  deleteAuth,
  checkAuth,
  checkAuthRoute
};
