import { put, takeLatest } from 'redux-saga/effects';
import { LOGIN_REQUEST, LOGOUT } from '../actionTypes/authActionTypes';
import { loginSuccess, loginFailure } from '../actionCreators/authCreators';
import { showNotificationRequest } from '../actionCreators/notificationCreators';
import { navigate } from '../../routes/navigation';

function* handleLogin(action) {
  try {
    console.log('Login attempted with credentials:', action.payload); // Debug
    const mockResponse = { token: 'mockToken123' };
    yield put(loginSuccess(mockResponse.token));
    yield put(showNotificationRequest("Login successful!", "success"));
    navigate('/');
  } catch (error) {
    yield put(loginFailure("Login Error"));
    yield put(showNotificationRequest("Login failed. Please try again.", "error"));
  }
}

function* handleLogout() {
  try {
    console.log('Logout attempted');
    yield put(showNotificationRequest("Logged out successfully.", "info"));
    navigate('/login');
  } catch (error) {
    console.error('Error during logout:', error); // Debug
    yield put(showNotificationRequest("Logout failed. Please try again.", "error"));
  }
}

function* watchAuthActions() {
  yield takeLatest(LOGIN_REQUEST, handleLogin);
  yield takeLatest(LOGOUT, handleLogout);
}

export default watchAuthActions;
