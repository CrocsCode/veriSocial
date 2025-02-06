// Initial rootSaga setup
import { all } from 'redux-saga/effects';
import watchAuthActions from './authSaga';
import { watchNotifications } from './notificationSaga';
import { watchModal } from './modalSaga';

export default function* rootSaga() {
    yield all([
        watchAuthActions(),
        watchNotifications(),
        watchModal(),
    ]);
}
