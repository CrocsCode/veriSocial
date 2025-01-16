import { put, takeLatest } from 'redux-saga/effects';
import { LOGIN_REQUEST, LOGIN_FAILURE, LOGOUT } from '../actionTypes/authActionTypes';
import { loginSuccess } from '../actionCreators/authCreators';
import { navigate } from '../../routes/navigation';

function* handleLogin(action) {
  try {
    console.log('Login attempted with credentials:', action.payload); // Debug

    const mockResponse = { token: 'mockToken123' };
    yield put(loginSuccess(mockResponse.token));
    navigate('/')
    console.log(history)
  } catch (error) {
    yield put({ type: LOGIN_FAILURE, payload: 'Mock login failure' });
  }
}

function* handleLogout() {
  try {
    console.log('Logout attempted');
    navigate('/login')
  } catch (error) {
    console.error('Error during logout:', error); // Debug
  }
}

function* watchAuthActions() {
  yield takeLatest(LOGIN_REQUEST, handleLogin);
  yield takeLatest(LOGOUT, handleLogout);
}

export default watchAuthActions;

