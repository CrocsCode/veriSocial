import { takeLatest, call, put } from 'redux-saga/effects';
import { REPORT_POST_REQUEST, REPORT_LIST_REQUEST } from '../actionTypes/reportActionTypes';
import { showNotificationRequest } from '../actionCreators/notificationCreators';
import { reportPostSuccess, reportPostFailure, reportListSuccess, reportListFailure } from '../actionCreators/reportCreators';
import T from '../../constants/text';
import api from '../../api';

function* handleReportPost({ payload }) {
  try {
    yield call(api.reportService.postReport, payload);
    yield put(showNotificationRequest(T.REPORT.POST.SUCCESS, "success"));
    yield put(reportPostSuccess(payload));
  } catch (error) {
    yield put(showNotificationRequest(T.REPORT.POST.ERROR, "error"));
    yield put(reportPostFailure(error.message));
  }
}

function* handleReportList() {
  try {
    const response = yield call(api.reportService.getReportList);
    console.log(response);
    yield put(reportListSuccess(response.message));
  } catch (error) {
    yield put(reportListFailure(error.message));
  }
}

export function* watchReportSaga() {
  yield takeLatest(REPORT_POST_REQUEST, handleReportPost);
  yield takeLatest(REPORT_LIST_REQUEST, handleReportList);
}
