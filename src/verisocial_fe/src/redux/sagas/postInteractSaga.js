import { call, put, takeLatest } from "redux-saga/effects";
import { LIKE_POST_REQUEST } from "../actionTypes/postInteractTypes";
import { likePostSuccess, likePostFailure, } from "../actionCreators/postInteractCreators";
import api from "../../api";
import { showNotificationRequest } from "../actionCreators/notificationCreators";
import T from "../../constants/text";

function* handleLikePost(action) {
    try {
      const response = yield call(api.postInteractService.likePost, action.payload);
      
      yield put(likePostSuccess(response));
      
      if (response.status === "success") {
        if (response.message === 1) {
          yield put(showNotificationRequest(T.INTERACTIONS.POST.LIKED, "success"));
        } else if (response.message === 0) {
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
  yield takeLatest(LIKE_POST_REQUEST, handleLikePost);
}

export default watchPostInteract;
