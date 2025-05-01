import { all } from 'redux-saga/effects';
import watchAuthActions from './authSaga';
import { watchNotifications } from './notificationSaga';
import { watchCreatePost } from './createPostSaga';
import { watchFeedSaga } from './feedSaga';
import { watchPostInteract } from './postInteractSaga';
import { watchGameSaga } from './gameSaga';
import { watchReportSaga } from './reportSaga';

export default function* rootSaga() {
    yield all([
        watchAuthActions(),
        watchNotifications(),
        watchCreatePost(),
        watchFeedSaga(),
        watchPostInteract(),
        watchGameSaga(),
        watchReportSaga(),
    ]);
}
