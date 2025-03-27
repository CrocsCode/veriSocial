import { LIKE_POST_REQUEST, LIKE_POST_SUCCESS, LIKE_POST_FAILURE} from "../actionTypes/postInteractTypes";

export const likePostRequest = (postId) => ({
    type: LIKE_POST_REQUEST,
    payload: postId,
});

export const likePostSuccess = (response) => ({
    type: LIKE_POST_SUCCESS,
    payload: response,
});

export const likePostFailure = (error) => ({
    type: LIKE_POST_FAILURE,
    payload: error,
});