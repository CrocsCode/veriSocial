import { put, takeLatest, delay } from "redux-saga/effects";
import { SHOW_NOTIFICATION_REQUEST, SHOW_NOTIFICATION_FAILURE } from "../actionTypes/notificationActionTypes";
import { showNotificationSuccess, showNotificationFailure } from "../actionCreators/notificationCreators";

function* handleShowNotification(action) {
    try {
        const { message, status } = action.payload;
        yield put(showNotificationSuccess(message, status));
    } catch (error) {
        yield put(showNotificationFailure(error.message));
    }
}

export function* watchNotifications() {
    yield takeLatest(SHOW_NOTIFICATION_REQUEST, handleShowNotification);
}
