import {
  LOAD_FEED_PAGE_REQUEST,
  LOAD_FEED_PAGE_REQUEST_SUCCESS,
  LOAD_FEED_PAGE_REQUEST_FAILURE,
  RESET_FEED,
} from "../actionTypes/feedActionTypes";
import { LIKE_POST_SUCCESS } from "../actionTypes/postInteractTypes";
import { GAME_EVENT_CLEAR } from "../actionTypes/gameActionTypes";

const initialState = {
  posts: [],
  loading: false,
  error: null,
  currentPage: 0,
  isLastPage: false,
};

const feedReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_FEED_PAGE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case LOAD_FEED_PAGE_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: [...state.posts, ...action.payload.posts],
        currentPage: action.payload.page,
        isLastPage: action.payload.isLastPage,
      };

    case LOAD_FEED_PAGE_REQUEST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case RESET_FEED:
      return { ...initialState };

    case LIKE_POST_SUCCESS: {
      const { postId, isLiked } = action.payload;
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.post_id === postId) {
            const updatedLikeCount =
              isLiked === 1 ? post["likes-count"] + 1 : post["likes-count"] - 1;
            return {
              ...post,
              "is-liked": isLiked,
              "likes-count": updatedLikeCount,
            };
          }
          return post;
        }),
      };
    };

    case GAME_EVENT_CLEAR: {
      const { gameEventId } = action.payload;
      return {
        ...state,
        posts: state.posts.filter(post => post.post_id !== gameEventId),
      };
    }

    default:
      return state;
  }
};

export default feedReducer;
