import { put, takeLatest } from "redux-saga/effects";
import { OPEN_MODAL_REQUEST, CLOSE_MODAL_REQUEST } from "../actionTypes/modalActionTypes";
import { openModalSuccess, openModalFailure, closeModalSuccess, closeModalFailure } from "../actionCreators/modalCreators";

function* handleOpenModal() {
  try {
    yield put(openModalSuccess());
  } catch (error) {
    yield put(openModalFailure());
  }
}

function* handleCloseModal() {
  try {
    yield put(closeModalSuccess());
  } catch (error) {
    yield put(closeModalFailure());
  }
}

export function* watchModal() {
  yield takeLatest(OPEN_MODAL_REQUEST, handleOpenModal);
  yield takeLatest(CLOSE_MODAL_REQUEST, handleCloseModal);
}
