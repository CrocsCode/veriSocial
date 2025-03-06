import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authReducer';
import notificationReducer from './notificationReducer';
import modalReducer from './modalReducer';
import createPostReducer from './createPostReducer';
import feedReducer from './feedReducer';

const authPersistConfig = {
    key: 'auth',
    storage, // localStorage
    whitelist: ['isAuthenticated', 'token', 'user'],
};

const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
    notification: notificationReducer,
    modal: modalReducer,
    createPost: createPostReducer,
    feed: feedReducer,
});

export default rootReducer;
