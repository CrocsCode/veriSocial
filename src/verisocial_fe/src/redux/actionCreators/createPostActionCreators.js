import {
    UPDATE_CREATE_POST_FORM,
    SUBMIT_CREATE_POST_FORM_REQUEST,
    SUBMIT_CREATE_POST_FORM_SUCCESS,
    SUBMIT_CREATE_POST_FORM_FAILURE,
    RESET_CREATE_POST_FORM,
} from "../actionTypes/createPostActionTypes";

export const updateCreatePostForm = (field, value) => ({
    type: UPDATE_CREATE_POST_FORM,
    payload: { field, value },
});

export const submitCreatePostFormRequest = (text, imageFile) => ({
    type: SUBMIT_CREATE_POST_FORM_REQUEST,
    payload: { text, imageFile },
});

export const submitCreatePostFormSuccess = (formData) => ({
    type: SUBMIT_CREATE_POST_FORM_SUCCESS,
    payload: formData,
});

export const submitCreatePostFormFailure = (error) => ({
    type: SUBMIT_CREATE_POST_FORM_FAILURE,
    payload: error,
});

export const resetCreatePostForm = () => ({
    type: RESET_CREATE_POST_FORM,
});
