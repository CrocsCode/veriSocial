
import { REPORT_POST_REQUEST, REPORT_POST_SUCCESS, REPORT_POST_FAILURE } from "../actionTypes/reportActionTypes";

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
