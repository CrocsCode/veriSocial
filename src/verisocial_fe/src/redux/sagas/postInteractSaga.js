import { call, put, takeLatest, all } from "redux-saga/effects";
import { FETCH_POST_FOCUS_REQUEST, LIKE_POST_REQUEST, } from "../actionTypes/postInteractTypes";
import {
  fetchPostFocusSuccess,
  fetchPostFocusFailure,
  likePostSuccess,
  likePostFailure,
} from "../actionCreators/postInteractCreators";
import { showNotificationRequest } from "../actionCreators/notificationCreators";
import T from "../../constants/text";
import api from "../../api";

function* handleFetchPostFocus(action) {
  try {
    const { userId, postId } = action.payload;
    const response = yield call(api.postInteractService.getPostFocus, userId, postId);
    yield put(fetchPostFocusSuccess(response.message));
  } catch (error) {
    yield put(fetchPostFocusFailure(error.message));
  }
}

function* handleLikePost(action) {
  try {
    const response = yield call(api.postInteractService.likePost, action.payload);
    const isLiked = response.message;

    yield put(likePostSuccess({ postId: action.payload, isLiked }));

    if (response.status === "success") {
      if (isLiked === 1) {
        yield put(showNotificationRequest(T.INTERACTIONS.POST.LIKED, "success"));
      } else {
        yield put(showNotificationRequest(T.INTERACTIONS.POST.UNLIKED, "info"));
      }
    } else {
      yield put(showNotificationRequest(T.GENERAL.ERROR, "error"));
    }
  } catch (error) {
    yield put(likePostFailure(error.message));
    yield put(showNotificationRequest(error.message || T.GENERAL.ERROR, "error"));
  }
}


function* watchPostInteract() {
  yield all([
    takeLatest(FETCH_POST_FOCUS_REQUEST, handleFetchPostFocus),
    takeLatest(LIKE_POST_REQUEST, handleLikePost),
  ]);
}

export default watchPostInteract;
