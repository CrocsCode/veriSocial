import {
  GAME_EVENT_LOAD_LIST_REQUEST,
  GAME_EVENT_LOAD_LIST_SUCCESS,
  GAME_EVENT_LOAD_LIST_FAILURE,
} from "../actionTypes/gameActionTypes";

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case GAME_EVENT_LOAD_LIST_REQUEST:
      return { ...state, loading: true, error: null };

    case GAME_EVENT_LOAD_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        list: action.payload.events,
        error: null,
      };

    case GAME_EVENT_LOAD_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
}

export default gameReducer;
