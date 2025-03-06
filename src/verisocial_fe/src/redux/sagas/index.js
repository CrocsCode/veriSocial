import { all } from 'redux-saga/effects';
import watchAuthActions from './authSaga';
import { watchNotifications } from './notificationSaga';
import { watchModal } from './modalSaga';
import { watchCreatePost } from './createPostSaga';
import { watchFeedSaga } from './feedSaga';

export default function* rootSaga() {
    yield all([
        watchAuthActions(),
        watchNotifications(),
        watchModal(),
        watchCreatePost(),
        watchFeedSaga(),
    ]);
}
