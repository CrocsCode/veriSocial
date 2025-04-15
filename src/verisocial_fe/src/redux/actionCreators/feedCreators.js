import {
    LOAD_FEED_PAGE_REQUEST,
    LOAD_FEED_PAGE_REQUEST_SUCCESS,
    LOAD_FEED_PAGE_REQUEST_FAILURE,
    RESET_FEED,
} from "../actionTypes/feedActionTypes";

export const loadFeedPageRequest = (page, pageSize) => ({
    type: LOAD_FEED_PAGE_REQUEST,
    payload: { page, pageSize },
});

export const loadFeedPageSuccess = (posts, page, isLastPage) => ({
    type: LOAD_FEED_PAGE_REQUEST_SUCCESS,
    payload: { posts, page, isLastPage },
});

export const loadFeedPageFailure = (error) => ({
    type: LOAD_FEED_PAGE_REQUEST_FAILURE,
    payload: error,
});

export const resetFeed = () => ({
    type: RESET_FEED,
  });
