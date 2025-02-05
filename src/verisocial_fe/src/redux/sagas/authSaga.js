import { put, takeLatest } from 'redux-saga/effects';
import { LOGIN_REQUEST, LOGOUT } from '../actionTypes/authActionTypes';
import { loginSuccess, loginFailure } from '../actionCreators/authCreators';
import { showNotificationRequest } from '../actionCreators/notificationCreators';
import { navigate } from '../../routes/navigation';
import T from '../../constants/text';

function* handleLogin(action) {
  try {
    console.log('Login attempted with credentials:', action.payload); // Debug
    const mockResponse = { token: 'mockToken123' };
    yield put(loginSuccess(mockResponse.token));
    yield put(showNotificationRequest(T.AUTH.LOGIN_SUCCESS, "success"));
    navigate('/');
  } catch (error) {
    yield put(loginFailure("Login Error"));
    yield put(showNotificationRequest(T.AUTH.LOGIN_FAILURE, "error"));
  }
}

function* handleLogout() {
  try {
    console.log('Logout attempted');
    yield put(showNotificationRequest(T.AUTH.LOGOUT_SUCCESS, "info"));
    navigate('/login');
  } catch (error) {
    console.error('Error during logout:', error); // Debug
    yield put(showNotificationRequest(T.AUTH.LOGOUT_FAILURE, "error"));
  }
}

function* watchAuthActions() {
  yield takeLatest(LOGIN_REQUEST, handleLogin);
  yield takeLatest(LOGOUT, handleLogout);
}

export default watchAuthActions;
