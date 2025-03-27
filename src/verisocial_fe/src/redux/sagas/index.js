import { all } from 'redux-saga/effects';
import watchAuthActions from './authSaga';
import { watchNotifications } from './notificationSaga';
import { watchCreatePost } from './createPostSaga';
import { watchFeedSaga } from './feedSaga';
import watchPostInteract from './postInteractSaga';

export default function* rootSaga() {
    yield all([
        watchAuthActions(),
        watchNotifications(),
        watchCreatePost(),
        watchFeedSaga(),
        watchPostInteract(),
    ]);
}
