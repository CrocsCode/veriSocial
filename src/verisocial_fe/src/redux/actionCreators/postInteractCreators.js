import {
    FETCH_POST_FOCUS_REQUEST,
    FETCH_POST_FOCUS_SUCCESS,
    FETCH_POST_FOCUS_FAILURE,
    LIKE_POST_REQUEST,
    LIKE_POST_SUCCESS,
    LIKE_POST_FAILURE,
    RESET_POST_FOCUS,
    LOAD_COMMENTS_REQUEST,
    LOAD_COMMENTS_SUCCESS,
    LOAD_COMMENTS_FAILURE,
    LIKE_COMMENT_SUCCESS,
    CREATE_COMMENT_REQUEST,
    CREATE_COMMENT_SUCCESS,
    CREATE_COMMENT_FAILURE,
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

export const likePostRequest = (post_id, comment_id = null) => ({
    type: LIKE_POST_REQUEST,
    payload: { post_id, comment_id },
});

export const likePostSuccess = ({ postId, isLiked }) => ({
    type: LIKE_POST_SUCCESS,
    payload: { postId, isLiked },
});

export const likeCommentSuccess = ({ postId, commentId, isLiked }) => ({
    type: LIKE_COMMENT_SUCCESS,
    payload: { postId, commentId, isLiked },
});

export const likePostFailure = (error) => ({
    type: LIKE_POST_FAILURE,
    payload: error,
});
export const resetPostFocus = () => ({
    type: RESET_POST_FOCUS,
});

export const loadCommentsRequest = (postId, page, pageSize) => ({
    type: LOAD_COMMENTS_REQUEST,
    payload: { postId, page, pageSize },
});

export const loadCommentsSuccess = (comments) => ({
    type: LOAD_COMMENTS_SUCCESS,
    payload: comments,
});

export const loadCommentsFailure = (error) => ({
    type: LOAD_COMMENTS_FAILURE,
    payload: error,
});

export const createCommentRequest = (comment) => ({
    type: CREATE_COMMENT_REQUEST,
    payload: comment,
});

export const createCommentSuccess = (comment) => ({
    type: CREATE_COMMENT_SUCCESS,
    payload: comment,
});

export const createCommentFailure = (error) => ({
    type: CREATE_COMMENT_FAILURE,
    payload: error,
});