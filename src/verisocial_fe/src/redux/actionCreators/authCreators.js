import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    USER_SUCCESS,
    USER_FAILURE,
} from "../actionTypes/authActionTypes";

export const loginRequest = (credentials) => ({
    type: LOGIN_REQUEST,
    payload: credentials,
});

export const loginSuccess = (token) => ({
    type: LOGIN_SUCCESS,
    payload: { token },
});

export const loginFailure = (error) => ({
    type: LOGIN_FAILURE,
    payload: error,
});

export const logout = () => ({
    type: LOGOUT,
});

export const registerRequest = (userData) => ({
    type: REGISTER_REQUEST,
    payload: userData,
});

export const registerSuccess = (user) => ({
    type: REGISTER_SUCCESS,
    payload: user,
});

export const registerFailure = (error) => ({
    type: REGISTER_FAILURE,
    payload: error,
});

export const userSuccess = (userDetails) => ({
    type: USER_SUCCESS,
    payload: { userDetails },
});

export const userFailure = (error) => ({
    type: USER_FAILURE,
    payload: error,
});