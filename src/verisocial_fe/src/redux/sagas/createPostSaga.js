import { put, takeLatest, select } from "redux-saga/effects";
import {
  SUBMIT_CREATE_POST_FORM_REQUEST,
  SUBMIT_CREATE_POST_FORM_SUCCESS,
  SUBMIT_CREATE_POST_FORM_FAILURE,
} from "../actionTypes/createPostActionTypes";
import { showNotificationRequest } from "../actionCreators/notificationCreators";
import { closeModalRequest } from "../actionCreators/modalCreators";
import T from "../../constants/text";

const selectCreatePostForm = (state) => state.createPostForm;

function* handleSubmitCreatePost() {
  try {
    const formData = yield select(selectCreatePostForm);
    yield put({ type: SUBMIT_CREATE_POST_FORM_SUCCESS, payload: formData });
    yield put(showNotificationRequest(T.FORM.POST.SUCCESS, "success"));
    yield put(closeModalRequest());
  } catch (error) {
    yield put({ type: SUBMIT_CREATE_POST_FORM_FAILURE, payload: error.message });
    yield put(showNotificationRequest(T.FORM.POST.FAILURE, "error"));
  }
}

export function* watchCreatePost() {
  yield takeLatest(SUBMIT_CREATE_POST_FORM_REQUEST, handleSubmitCreatePost);
}
