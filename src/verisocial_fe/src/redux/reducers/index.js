import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authReducer';
import notificationReducer from './notificationReducer';
import createPostReducer from './createPostReducer';
import feedReducer from './feedReducer';
import postInteractReducer from './postInteractReducer';
import gameReducer from './gameReducer';

const authPersistConfig = {
    key: 'auth',
    storage, // localStorage
    whitelist: ['isAuthenticated', 'token', 'user'],
};

const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
    notification: notificationReducer,
    createPost: createPostReducer,
    feed: feedReducer,
    postInteract: postInteractReducer,
    game: gameReducer,
});

export default rootReducer;
