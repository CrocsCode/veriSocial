import { put, takeLatest, select, call } from "redux-saga/effects";
import {
  SUBMIT_CREATE_POST_FORM_REQUEST,
} from "../actionTypes/createPostActionTypes";
import { submitCreatePostFormSuccess, submitCreatePostFormFailure } from "../actionCreators/createPostActionCreators";
import { showNotificationRequest } from "../actionCreators/notificationCreators";
import { loadFeedPageRequest, resetFeed } from "../actionCreators/feedCreators";
import T from "../../constants/text";
import api from "../../api";

function* handleSubmitCreatePost({ payload: { text, imageFile } }) {
  try {
    const userDetails = yield select((state) => state.auth.user);

    const formData = new FormData();
    formData.append("content", text);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    yield call(api.formService.createMultipartPost, userDetails.user_id, formData);
    yield put(submitCreatePostFormSuccess());
    yield put(showNotificationRequest(T.FORM.POST.SUCCESS, "success"));
    yield put(resetFeed());
    yield put(loadFeedPageRequest(1, 8));
  } catch (error) {
    yield put(submitCreatePostFormFailure(error.message));
    yield put(showNotificationRequest(T.FORM.POST.FAILURE, "error"));
  }
}

export function* watchCreatePost() {
  yield takeLatest(SUBMIT_CREATE_POST_FORM_REQUEST, handleSubmitCreatePost);
}
