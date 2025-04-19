import { call, put, takeLatest, delay } from "redux-saga/effects";
import { LOAD_FEED_PAGE_REQUEST } from "../actionTypes/feedActionTypes";
import { loadFeedPageSuccess, loadFeedPageFailure } from "../actionCreators/feedCreators";
import api from "../../api";

function* fetchGameEvent() {
  yield delay(100); // simulate game api call (TEMP)
  return {
    bot_image: "https://example.com/mock-bot.jpg",
    human_image: "https://example.com/mock-human.jpg",
  };
}

function* loadFeedPageSaga(action) {
  try {
    const { page, pageSize } = action.payload;
    const response = yield call(api.feedService.getPosts, page, pageSize);

    if (response.status === "success" && Array.isArray(response.message)) {
      let posts = response.message;

      if (Math.random() < 0.33) { // 1/3 chance to spawn game event
        try {
          const { bot_image, human_image } = yield call(fetchGameEvent);
          const gamePost = {
            post_id: `game-${Date.now()}`,
            post_type: "game",
            bot_image,
            human_image,
            created_at: new Date().toISOString(),
          };
          const insertAt = Math.floor(Math.random() * (posts.length + 1));
          posts = [...posts.slice(0, insertAt), gamePost, ...posts.slice(insertAt),];
        } catch (gameErr) {
          yield put(loadFeedPageFailure(gameErr)); // TEMP
        }
      }

      const isLastPage = posts.length < pageSize;
      yield put(loadFeedPageSuccess(posts, page, isLastPage));
    } else {
      yield put(loadFeedPageFailure(response.message));
    }
  } catch (error) {
    yield put(loadFeedPageFailure(error.message));
  }
}

export function* watchFeedSaga() {
  yield takeLatest(LOAD_FEED_PAGE_REQUEST, loadFeedPageSaga);
}
