import {
  GAME_EVENT_LOAD_LIST_REQUEST,
  GAME_EVENT_LOAD_LIST_SUCCESS,
  GAME_EVENT_LOAD_LIST_FAILURE,
  GAME_LOAD_LEADERBOARD_REQUEST,
  GAME_LOAD_LEADERBOARD_SUCCESS,
  GAME_LOAD_LEADERBOARD_FAILURE,
} from "../actionTypes/gameActionTypes";

const initialState = {
  list: [],
  loading: false,
  error: null,
  leaderboard: [],
  userRank: null,
  loadingLeaderboard: false,
  errorLeaderboard: null,
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

    case GAME_LOAD_LEADERBOARD_REQUEST:
      return { ...state, loadingLeaderboard: true, errorLeaderboard: null };

    case GAME_LOAD_LEADERBOARD_SUCCESS: {
      const { leaderboard, user_rank } = action.payload.leaderboardList;
      return {
        ...state,
        loadingLeaderboard: false,
        leaderboard,
        userRank: user_rank,
      };
    }

    case GAME_LOAD_LEADERBOARD_FAILURE:
      return {
        ...state,
        loadingLeaderboard: false,
        errorLeaderboard: action.payload,
      };

    default:
      return state;
  }
}

export default gameReducer;
