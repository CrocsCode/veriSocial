import { takeLatest, call, put } from 'redux-saga/effects';
import { REPORT_POST_REQUEST } from '../actionTypes/reportActionTypes';
import { showNotificationRequest } from '../actionCreators/notificationCreators';
import { reportPostSuccess, reportPostFailure } from '../actionCreators/reportCreators';
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

export function* watchReportSaga() {
  yield takeLatest(REPORT_POST_REQUEST, handleReportPost);
}
