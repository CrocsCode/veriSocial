import {
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
} from "../actionTypes/authActionTypes";

const initialState = {
    token: null,
    user: null,
    isAuthenticated: false,
    error: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user,
                isAuthenticated: true,
                error: null,
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case REGISTER_SUCCESS:
            return {
                ...state,
                user: action.payload,
                error: null,
            };
        case REGISTER_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case LOGOUT:
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
            };
        default:
            return state;
    }
};

export default authReducer;
