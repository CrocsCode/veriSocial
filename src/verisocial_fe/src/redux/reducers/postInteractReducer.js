import {
  FETCH_POST_FOCUS_REQUEST,
  FETCH_POST_FOCUS_SUCCESS,
  FETCH_POST_FOCUS_FAILURE,
  LIKE_COMMENT_SUCCESS,
  RESET_POST_FOCUS,
  LOAD_COMMENTS_REQUEST,
  LOAD_COMMENTS_SUCCESS,
  LOAD_COMMENTS_FAILURE,
  CREATE_COMMENT_REQUEST,
  CREATE_COMMENT_SUCCESS,
  CREATE_COMMENT_FAILURE,
} from "../actionTypes/postInteractTypes";

const initialState = {
  postFocus: null,
  loadingFocus: false,
  focusError: null,
  comments: [],
  loadingComments: false,
  commentsError: null,
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
        comments: [],
      };

    case LIKE_COMMENT_SUCCESS: {
      const { commentId, isLiked } = action.payload;
      const updatedComments = state.comments.map((comment) => {
        if (Number(comment["comment-id"]) === Number(commentId)) {
          const newCount =
            isLiked === 1
              ? comment["likes-count"] + 1
              : comment["likes-count"] - 1;
          return {
            ...comment,
            "is-liked": isLiked,
            "likes-count": newCount,
          };
        }
        return comment;
      });
      return {
        ...state,
        comments: updatedComments,
      };
    }

    case LOAD_COMMENTS_REQUEST:
      return {
        ...state,
        loadingComments: true,
        commentsError: null,
      };
    case LOAD_COMMENTS_SUCCESS:
      return {
        ...state,
        loadingComments: false,
        comments: action.payload,
      };
    case LOAD_COMMENTS_FAILURE:
      return {
        ...state,
        loadingComments: false,
        commentsError: action.payload,
      };

    case CREATE_COMMENT_REQUEST:
      return state;
    case CREATE_COMMENT_SUCCESS:
      return {
        ...state,
        comments: [action.payload, ...state.comments],
      };

    case CREATE_COMMENT_FAILURE:
      return {
        ...state,
        commentsError: action.payload,
      };

    default:
      return state;
  }
};

export default postInteractReducer;
