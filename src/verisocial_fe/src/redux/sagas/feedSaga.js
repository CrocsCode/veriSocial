import { call, put, takeLatest } from "redux-saga/effects";
import { LOAD_FEED_PAGE_REQUEST } from "../actionTypes/feedActionTypes";
import { loadFeedPageSuccess, loadFeedPageFailure } from "../actionCreators/feedCreators";
import api from "../../api";

function* loadFeedPageSaga(action) {
  try {
    const { page, pageSize } = action.payload;
    // console.log("Calling API with:", page, pageSize); // Debug

    const response = yield call(api.feedService.getPosts, page, pageSize);
    // console.log("Full API Response:", response); // Debug

    if (response.status === "success" && Array.isArray(response.message)) {
      const isLastPage = response.message.length < pageSize;
      yield put(loadFeedPageSuccess(response.message, page, isLastPage));
    } else {
      yield put(loadFeedPageFailure(response.message));
    }
  } catch (error) {
    // console.error("API Error:", error.message); // Debug
    yield put(loadFeedPageFailure(error.message));
  }
}

export function* watchFeedSaga() {
  yield takeLatest(LOAD_FEED_PAGE_REQUEST, loadFeedPageSaga);
}
