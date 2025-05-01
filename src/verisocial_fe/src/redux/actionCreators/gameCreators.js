import {
  GAME_EVENT_CLEAR,
  GAME_EVENT_ADD_SCORE,
  GAME_EVENT_LOAD_LIST_REQUEST,
  GAME_EVENT_LOAD_LIST_SUCCESS,
  GAME_EVENT_LOAD_LIST_FAILURE,
} from "../actionTypes/gameActionTypes";

export const clearGameEvent = (gameEventId) => ({
  type: GAME_EVENT_CLEAR,
  payload: { gameEventId },
});

export const addGameEventScore = (result, correctPostId, wrongPostId) => ({
  type: GAME_EVENT_ADD_SCORE,
  payload: { result, correctPostId, wrongPostId },
});

export const loadGameEventListRequest = () => ({
  type: GAME_EVENT_LOAD_LIST_REQUEST,
});

export const loadGameEventListSuccess = (events) => ({
  type: GAME_EVENT_LOAD_LIST_SUCCESS,
  payload: { events },
});

export const loadGameEventListFailure = (error) => ({
  type: GAME_EVENT_LOAD_LIST_FAILURE,
  payload: error,
});
