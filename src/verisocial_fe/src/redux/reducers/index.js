import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authReducer';
import notificationReducer from './notificationReducer';

const authPersistConfig = {
    key: 'auth',
    storage, // localStorage
    whitelist: ['isAuthenticated'],
};

const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
    notification: notificationReducer,
});

export default rootReducer;
