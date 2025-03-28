import {
  FETCH_POST_FOCUS_REQUEST,
  FETCH_POST_FOCUS_SUCCESS,
  FETCH_POST_FOCUS_FAILURE,
  LIKE_POST_SUCCESS,
  RESET_POST_FOCUS,
} from "../actionTypes/postInteractTypes";

const initialState = {
  postFocus: null,
  loadingFocus: false,
  focusError: null,
};

const postInteractReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_POST_FOCUS_REQUEST:
      return {
        ...state,
        loadingFocus: true,
        focusError: null,
      };

    case FETCH_POST_FOCUS_SUCCESS:
      return {
        ...state,
        loadingFocus: false,
        postFocus: action.payload,
      };

    case FETCH_POST_FOCUS_FAILURE:
      return {
        ...state,
        loadingFocus: false,
        focusError: action.payload,
      };

    case RESET_POST_FOCUS:
      return {
        ...state,
        postFocus: null,
      };

    case LIKE_POST_SUCCESS: {
      const { postId, isLiked } = action.payload;
      if (!state.postFocus || state.postFocus.post_id !== postId) {
        return state;
      }
      const updatedLikeCount = isLiked
        ? state.postFocus["likes-count"] + 1
        : state.postFocus["likes-count"] - 1;
      return {
        ...state,
        postFocus: {
          ...state.postFocus,
          "is-liked": isLiked,
          "likes-count": updatedLikeCount,
        },
      };
    }

    default:
      return state;
  }
};

export default postInteractReducer;
