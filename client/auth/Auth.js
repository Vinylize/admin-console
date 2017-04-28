import firebase from 'firebase';
import client from '../util/lokka';
import { refs } from '../util/firebase';

const checkAuth = () => firebase.auth().currentUser;

const checkAuthRoute = (nextState, transition) => {
  if (!checkAuth()) {
    if (nextState.location.pathname !== '/login') {
      transition({
        pathname: '/login',
        state: nextState.location.pathname
      });
    }
  }
};

const getAuth = (email, password) => new Promise((resolve, reject) => {
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((user) => {
    const uid = user.uid;
    return refs.user.root.child(uid).once('value')
      .then((snap) => {
        if (snap.child('permission').val() === 'admin') return resolve();
        return firebase.auth().signOut().then(() => reject('You are not authorized'));
      });
  })
  .then(() =>
    firebase.auth().getToken()
      .then((token) => {
        /* eslint-disable no-underscore-dangle */
        client._transport._httpOptions.headers = {
          authorization: token.accessToken,
        };
        /* eslint-enable no-underscore-dangle */
        return resolve();
      })
  )
  .catch((error) => {
    reject(error);
  });
});


const deleteAuth = (nextState, transition) => {
  if (!checkAuth()) {
    alert('Login first!');
    transition('/');
  } else {
    const email = firebase.auth().currentUser.email;
    firebase.auth().signOut().then(() => {
      alert(`${email} is logged out!`);
    }, (error) => {
      alert(error);
    });
    transition('/login');
  }
};

export {
  getAuth,
  deleteAuth,
  checkAuth,
  checkAuthRoute
};
