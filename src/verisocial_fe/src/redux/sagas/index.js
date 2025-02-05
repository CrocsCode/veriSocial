// Initial rootSaga setup
import { all } from 'redux-saga/effects';
import watchAuthActions from './authSaga';
import { watchNotifications } from './notificationSaga';

export default function* rootSaga() {
    yield all([
        watchAuthActions(),
        watchNotifications(),
    ]);
}
