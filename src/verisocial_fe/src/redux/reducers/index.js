import { combineReducers } from 'redux';
import authReducer from './authReducer';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const authPersistConfig = {
    key: 'auth',
    storage, // localStorage
    whitelist: ['isAuthenticated'],
};

const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
});

export default rootReducer;
