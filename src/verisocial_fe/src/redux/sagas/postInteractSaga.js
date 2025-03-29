import { call, put, takeLatest, all } from "redux-saga/effects";
import {
  FETCH_POST_FOCUS_REQUEST,
  LIKE_POST_REQUEST,
  LOAD_COMMENTS_REQUEST,
  CREATE_COMMENT_REQUEST,
} from "../actionTypes/postInteractTypes";
import {
  fetchPostFocusSuccess,
  fetchPostFocusFailure,
  likePostSuccess,
  likeCommentSuccess,
  likePostFailure,
  loadCommentsSuccess,
  loadCommentsFailure,
  createCommentSuccess,
  createCommentFailure,
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
    const { post_id, comment_id } = action.payload;
    const response = yield call(api.postInteractService.likePost, post_id, comment_id);
    const isLiked = response.message;

    if (comment_id != null) {
      yield put(likeCommentSuccess({ postId: post_id, commentId: comment_id, isLiked }));
      if (response.status === "success") {
        yield put(
          showNotificationRequest(
            isLiked === 1 ? T.INTERACTIONS.COMMENT.LIKED : T.INTERACTIONS.COMMENT.UNLIKED,
            isLiked === 1 ? "success" : "info"
          )
        );
      } else {
        yield put(showNotificationRequest(T.GENERAL.ERROR, "error"));
      }
    } else {
      yield put(likePostSuccess({ postId: post_id, isLiked }));
      if (response.status === "success") {
        yield put(
          showNotificationRequest(
            isLiked === 1 ? T.INTERACTIONS.POST.LIKED : T.INTERACTIONS.POST.UNLIKED,
            isLiked === 1 ? "success" : "info"
          )
        );
      } else {
        yield put(showNotificationRequest(T.GENERAL.ERROR, "error"));
      }
    }
  } catch (error) {
    yield put(likePostFailure(error.message));
    yield put(showNotificationRequest(error.message || T.GENERAL.ERROR, "error"));
  }
}

function* handleLoadComments(action) {
  try {
    const { postId, page, pageSize } = action.payload;
    const response = yield call(api.postInteractService.getComments, postId, page, pageSize);
    if (response.status === "success") {
      yield put(loadCommentsSuccess(response.message));
    } else {
      yield put(loadCommentsFailure("Failed to load comments"));
    }
  } catch (error) {
    yield put(loadCommentsFailure(error.message));
  }
}

function* handleCreateComment(action) {
  try {
    const { post_id, content } = action.payload;
    const response = yield call(api.postInteractService.postComment, { post_id, content });
    if (response.status === "success") {
      yield put(createCommentSuccess(response.message));
      yield put(showNotificationRequest(T.INTERACTIONS.COMMENT.CREATE, "success"))
    } else {
      yield put(createCommentFailure(T.INTERACTIONS.COMMENT.CREATE_FAILURE));
      yield put(showNotificationRequest(T.INTERACTIONS.COMMENT.CREATE_FAILURE || T.GENERAL.ERROR, "error"))
    }
  } catch (error) {
    yield put(createCommentFailure(error.message));
  }
}


function* watchPostInteract() {
  yield all([
    takeLatest(FETCH_POST_FOCUS_REQUEST, handleFetchPostFocus),
    takeLatest(LIKE_POST_REQUEST, handleLikePost),
    takeLatest(LOAD_COMMENTS_REQUEST, handleLoadComments),
    takeLatest(CREATE_COMMENT_REQUEST, handleCreateComment),
  ]);
}

export default watchPostInteract;
