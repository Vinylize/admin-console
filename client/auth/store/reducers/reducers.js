import { SET_AUTH } from '../actions/actions';
import { combineReducers } from 'redux';

const initialState = {
    user : {
        email : '',
        role : 'Anonymous',
        lastAuth : '',
        token : ''
    }
};

const reducer = (state = initialState, action) => {
    switch(action.type){
        case SET_AUTH :
            return Object.assign({}, state.user, {
                email : action.email,
                role : Anonymous,
                lastAuth : '',
                token : action.token
            })
    }
};

const reducers = combineReducers({
    reducer
});

export default reducers;