import {
    FETCH_POST_FOCUS_REQUEST,
    FETCH_POST_FOCUS_SUCCESS,
    FETCH_POST_FOCUS_FAILURE,
    LIKE_POST_REQUEST,
    LIKE_POST_SUCCESS,
    LIKE_POST_FAILURE,
    RESET_POST_FOCUS,
} from "../actionTypes/postInteractTypes";

export const fetchPostFocusRequest = (userId, postId) => ({
    type: FETCH_POST_FOCUS_REQUEST,
    payload: { userId, postId },
  });

export const fetchPostFocusSuccess = (post) => ({
    type: FETCH_POST_FOCUS_SUCCESS,
    payload: post,
});

export const fetchPostFocusFailure = (error) => ({
    type: FETCH_POST_FOCUS_FAILURE,
    payload: error,
});

export const likePostRequest = (postId) => ({
    type: LIKE_POST_REQUEST,
    payload: postId,
});

export const likePostSuccess = ({ postId, isLiked }) => ({
    type: LIKE_POST_SUCCESS,
    payload: { postId, isLiked },
});

export const likePostFailure = (error) => ({
    type: LIKE_POST_FAILURE,
    payload: error,
});

export const resetPostFocus = () => ({
    type: RESET_POST_FOCUS,
});
