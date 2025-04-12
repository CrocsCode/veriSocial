import { call, put, takeLatest } from "redux-saga/effects";
import { LOGIN_REQUEST, LOGOUT, REGISTER_REQUEST, USER_REQUEST } from "../actionTypes/authActionTypes";
import { loginSuccess, loginFailure, userSuccess, userFailure } from "../actionCreators/authCreators";
import { showNotificationRequest } from "../actionCreators/notificationCreators";
import { registerFailure } from "../actionCreators/authCreators";
import { navigate } from "../../routes/navigation";
import api from "../../api";
import T from "../../constants/text";
import { axiosInstance } from "../../api/axiosInstance";
import { setAuthToken } from "../../api/axiosInstance";
import { resetFeed } from "../actionCreators/feedCreators";

function* handleLogin(action) {
  try {
    const { email, password } = action.payload;
    const response = yield call(api.authService.login, { email, password });

    // Check Login Creds
    if (response.status === "success") {
      const { id, token } = response.message;
      setAuthToken(token); // In Memory for Initial Login
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      yield put(loginSuccess(token));
      yield put(resetFeed());
      
      const userResponse = yield call(api.authService.getUser, id);

      // Check UserDetails from Login Response
      if (userResponse.status === "success") {
        const filteredUser = {
          user_id: userResponse.message.user_id,
          username: userResponse.message.username,
          email: userResponse.message.email,
          full_name: userResponse.message.full_name,
          bio: userResponse.message.bio,
          bot_score: userResponse.message["bot-score"],
          created_at: userResponse.message["created-at"],
        };
        yield put(userSuccess(filteredUser));
        yield put(showNotificationRequest(T.AUTH.LOGIN_SUCCESS, "success"));
        navigate("/");
      } else {
        yield put(userFailure("Failed to fetch user details."));
      }
    } else {
      yield put(loginFailure(response.message || T.AUTH.LOGIN_FAILURE));
      yield put(showNotificationRequest(response.message || T.AUTH.LOGIN_FAILURE, "error"));
    }
  } catch (error) {
    yield put(loginFailure(error.response?.data?.message || T.AUTH.LOGIN_FAILURE));
    yield put(showNotificationRequest(error.response?.data?.message || T.AUTH.LOGIN_FAILURE, "error"));
  }
}

function* handleLogout() {
  try {
    yield put(showNotificationRequest(T.AUTH.LOGOUT_SUCCESS, "info"));
    navigate("/login");
  } catch {
    yield put(showNotificationRequest(T.AUTH.LOGOUT_FAILURE, "error"));
  }
}

function* handleRegister(action) {
  try {
    const { username, name, email, password, confirmPassword } = action.payload;

    if (password !== confirmPassword) {
      yield put(registerFailure("Passwords do not match."));
      yield put(showNotificationRequest("Passwords do not match.", "error"));
      return;
    }

    const finalUsername = username && username.startsWith("@")
      ? username
      : `@${name.replace(/\s+/g, "").toLowerCase()}`;

    const response = yield call(api.authService.register, {
      username: finalUsername,
      "full-name": name,
      email,
      "bio": "Edit Bio",
      password,
      "bot-score": 0,
    });

    if (response.status === "success") {
      yield put(showNotificationRequest(T.AUTH.REGISTER_SUCCESS, "success"));
      window.location.reload();
    } else {
      yield put(registerFailure(response.data.message || T.AUTH.REGISTER_FAILURE));
      yield put(showNotificationRequest(response.data.message || T.AUTH.REGISTER_FAILURE, "error"));
    }
  } catch (error) {
    yield put(registerFailure(error.response?.data?.message || T.AUTH.REGISTER_FAILURE));
    yield put(showNotificationRequest(error.response?.data?.message || T.AUTH.REGISTER_FAILURE, "error"));
  }
}

function* handleUserDetails(action) {
  try {
    const response = yield call(api.authService.getUser, action.payload);

    if (response.status === "success") {
      const filteredUser = {
        user_id: response.message.user_id,
        username: response.message.username,
        email: response.message.email,
        full_name: response.message.full_name,
        bio: response.message.bio,
        bot_score: response.message["bot-score"],
        created_at: response.message["created-at"],
      };
      yield put(userSuccess(filteredUser));
    } else {
      yield put(userFailure(response.message || "Failed to fetch user details."));
    }
  } catch (error) {
    yield put(userFailure(error.response?.data?.message || "Failed to fetch user details."));
  }
}

function* watchAuthActions() {
  yield takeLatest(LOGIN_REQUEST, handleLogin);
  yield takeLatest(LOGOUT, handleLogout);
  yield takeLatest(REGISTER_REQUEST, handleRegister);
  yield takeLatest(USER_REQUEST, handleUserDetails);
}

export default watchAuthActions;
