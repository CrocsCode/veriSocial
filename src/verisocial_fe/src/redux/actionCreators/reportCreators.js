
import {
    REPORT_POST_REQUEST, REPORT_POST_SUCCESS, REPORT_POST_FAILURE,
    REPORT_LIST_REQUEST, REPORT_LIST_SUCCESS, REPORT_LIST_FAILURE
} from "../actionTypes/reportActionTypes";

export const reportPostRequest = (reportData) => ({
    type: REPORT_POST_REQUEST,
    payload: reportData,
});

export const reportPostSuccess = (reportData) => ({
    type: REPORT_POST_SUCCESS,
    payload: reportData,
});

export const reportPostFailure = (error) => ({
    type: REPORT_POST_FAILURE,
    payload: error,
});

export const reportListRequest = () => ({
    type: REPORT_LIST_REQUEST,
});

export const reportListSuccess = (reportListData) => ({
    type: REPORT_LIST_SUCCESS,
    payload: reportListData,
});

export const reportListFailure = (error) => ({
    type: REPORT_LIST_FAILURE,
    payload: error,
});
