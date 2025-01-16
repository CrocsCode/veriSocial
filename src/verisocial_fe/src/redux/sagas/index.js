// Initial rootSaga setup
import { all } from 'redux-saga/effects';
import watchAuthActions from './authSaga';

export default function* rootSaga() {
    yield all([
        watchAuthActions(),
    ]);
}
