import {
    OPEN_MODAL_REQUEST,
    OPEN_MODAL_SUCCESS,
    OPEN_MODAL_FAILURE,
    CLOSE_MODAL_REQUEST,
    CLOSE_MODAL_SUCCESS,
    CLOSE_MODAL_FAILURE,
} from "../actionTypes/modalActionTypes";

export const openModalRequest = () => ({
    type: OPEN_MODAL_REQUEST,
});

export const openModalSuccess = () => ({
    type: OPEN_MODAL_SUCCESS,
});

export const openModalFailure = (error) => ({
    type: OPEN_MODAL_FAILURE,
    payload: error,
});

export const closeModalRequest = () => ({
    type: CLOSE_MODAL_REQUEST,
});

export const closeModalSuccess = () => ({
    type: CLOSE_MODAL_SUCCESS,
});

export const closeModalFailure = (error) => ({
    type: CLOSE_MODAL_FAILURE,
    payload: error,
});
