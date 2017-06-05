import { createStore } from 'redux';
import authReducers from './reducers/auth.reducers';

const store = createStore(authReducers);

export default store;
