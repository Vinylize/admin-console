import { combineReducers } from 'redux';
import { SAVEAUTH, DESTROYAUTH } from '../actions/auth.actions';

const authInitialState = {
  currentUser: null,
  token: null
};

const auth = (state = authInitialState, action) => {
  switch (action.type) {
    case SAVEAUTH:
      return Object.assign({}, state, {
        currentUser: action.user,
        token: action.token
      });
    case DESTROYAUTH:
      return Object.assign({}, state, {
        currentUser: null,
        token: null
      });
    default:
      return state;
  }
};

const authReducers = combineReducers({
  auth
});

export default authReducers;
