import { call, takeLatest, put } from 'redux-saga/effects';
import { GAME_EVENT_ADD_SCORE, GAME_EVENT_LOAD_LIST_REQUEST } from '../actionTypes/gameActionTypes';
import { loadGameEventListSuccess, loadGameEventListFailure, loadGameEventListRequest } from '../actionCreators/gameCreators';
import { showNotificationRequest } from '../actionCreators/notificationCreators';
import T from '../../constants/text';
import api from '../../api';

function* handleAddGameEventScore(action) {
  const { result, correctPostId, wrongPostId } = action.payload;

  try {
    const response = yield call(api.gameService.addGameResult, {
      result,
      correct_post_id: correctPostId,
      wrong_post_id: wrongPostId,
    });

    if (response.status === 'success') {
      const { is_correct } = response.message;

      if (is_correct) {
        yield put(showNotificationRequest(T.GAME.RESULT.CORRECT, 'success'));
        yield put(loadGameEventListRequest());
      } else {
        yield put(showNotificationRequest(T.GAME.RESULT.WRONG, 'info'));
        yield put(loadGameEventListRequest());
      }
    } else {
      yield put(showNotificationRequest(T.GAME.ERROR, 'error'));
    }

  } catch (err) {
    yield put(showNotificationRequest(T.GAME.ERROR, 'error'));
    yield put(loadGameEventListFailure(err.message));
  }
}

function* handleLoadGameEventList() {
  try {
    const response = yield call(api.gameService.getGameEventList);

    if (response.status === 'success' && Array.isArray(response.message)) {
      yield put(loadGameEventListSuccess(response.message));
    } else {
      yield put(loadGameEventListFailure(response.message || 'Failed to load game history')
      );
    }
  } catch (err) {
    yield put(loadGameEventListFailure(err.message));
  }
}

export function* watchGameSaga() {
  yield takeLatest(GAME_EVENT_ADD_SCORE, handleAddGameEventScore);
  yield takeLatest(GAME_EVENT_LOAD_LIST_REQUEST, handleLoadGameEventList);
}
