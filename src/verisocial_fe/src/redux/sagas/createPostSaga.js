import { put, takeLatest, select, call } from "redux-saga/effects";
import {
  SUBMIT_CREATE_POST_FORM_REQUEST,
} from "../actionTypes/createPostActionTypes";
import { submitCreatePostFormSuccess, submitCreatePostFormFailure } from "../actionCreators/createPostActionCreators";
import { showNotificationRequest } from "../actionCreators/notificationCreators";
import { loadFeedPageRequest, resetFeed } from "../actionCreators/feedCreators";
import T from "../../constants/text";
import api from "../../api";

const selectCreatePostForm = (state) => state.createPost;
const selectUserId = (state) => state.auth.user;

function* handleSubmitCreatePost() {
  try {
    const formData = yield select(selectCreatePostForm);
    const userDetails = yield select(selectUserId);
    // console.log("Formdata:", formData); // Debug
    let base64Only = null;
    if (formData.image) {
      base64Only = formData.image.replace(/^data:image\/\w+;base64,/, "");
    }
    const payload = {
      "user-id": userDetails.user_id,
      content: formData.postText,
      base64_image: base64Only || null,
    };
    // console.log("Payload:", payload); // Debug
    yield call(api.formService.createPost, userDetails.user_id, payload);
    yield put(submitCreatePostFormSuccess(formData));
    yield put(showNotificationRequest(T.FORM.POST.SUCCESS, "success"));
    yield put(resetFeed());
    yield put((loadFeedPageRequest(1, 8)));
  } catch (error) {
    yield put(submitCreatePostFormFailure(error.message));
    yield put(showNotificationRequest(T.FORM.POST.FAILURE, "error"));
  }
}

export function* watchCreatePost() {
  yield takeLatest(SUBMIT_CREATE_POST_FORM_REQUEST, handleSubmitCreatePost);
}
