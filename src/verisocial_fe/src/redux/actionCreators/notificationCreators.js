import { SHOW_NOTIFICATION_REQUEST, SHOW_NOTIFICATION_SUCCESS, SHOW_NOTIFICATION_FAILURE } from "../actionTypes/notificationActionTypes";

export const showNotificationRequest = (message, status = "info") => ({
    type: SHOW_NOTIFICATION_REQUEST,
    payload: { message, status },
});

export const showNotificationSuccess = (message, status) => ({
    type: SHOW_NOTIFICATION_SUCCESS,
    payload: { message, status },
});

export const showNotificationFailure = (error) => ({
    type: SHOW_NOTIFICATION_FAILURE,
    payload: error,
});
