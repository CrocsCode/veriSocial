import { LOAD_FEED_PAGE_REQUEST, LOAD_FEED_PAGE_REQUEST_SUCCESS, LOAD_FEED_PAGE_REQUEST_FAILURE } from "../actionTypes/feedActionTypes";

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

        default:
            return state;
    }
};

export default feedReducer;
