import firebase from 'firebase';
import config from '../../config/environment';

const checkAuthRoute = (nextState, transition) => {
  if (!firebase.apps.length || !firebase.auth().currentUser) {
    if (nextState.location.pathname !== '/login') {
      transition({
        pathname: '/login',
        state: nextState.location.pathname
      });
    }
  }
};

const checkAuth = () => firebase.apps.length && firebase.auth().currentUser;

const getAuth = (email, password) => new Promise((resolve, reject) => {
  if (firebase.apps.length === 0) firebase.initializeApp(config.firebase);
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((result) => {
    resolve(result);
  })
  .catch((error) => {
    reject(error);
  });
});


const deleteAuth = (nextState, transition) => {
  if (!checkAuth()) transition('/');
  const email = firebase.auth().currentUser.email;
  firebase.auth().signOut().then(() => {
    alert(`${email} is logged out!`);
  }, (error) => {
    alert(error);
  });
  transition('/');
};

export {
  getAuth,
  deleteAuth,
  checkAuth,
  checkAuthRoute
};
