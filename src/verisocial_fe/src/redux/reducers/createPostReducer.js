import {
    UPDATE_CREATE_POST_FORM,
    SUBMIT_CREATE_POST_FORM_REQUEST,
    SUBMIT_CREATE_POST_FORM_SUCCESS,
    SUBMIT_CREATE_POST_FORM_FAILURE,
    RESET_CREATE_POST_FORM,
} from "../actionTypes/createPostActionTypes";

const initialState = {
    postText: "",
    image: null,
    isLoading: false,
    error: null,
    isSuccess: false,
};

const createPostReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_CREATE_POST_FORM:
            return {
                ...state,
                [action.payload.field]: action.payload.value,
            };

        case SUBMIT_CREATE_POST_FORM_REQUEST:
            return { ...state, isLoading: true, error: null, isSuccess: false };

        case SUBMIT_CREATE_POST_FORM_SUCCESS:
            return { ...initialState, isSuccess: true };

        case SUBMIT_CREATE_POST_FORM_FAILURE:
            return { ...state, isLoading: false, error: action.payload, isSuccess: false };

        case RESET_CREATE_POST_FORM:
            return { ...initialState };

        default:
            return state;
    }
};

export default createPostReducer;
