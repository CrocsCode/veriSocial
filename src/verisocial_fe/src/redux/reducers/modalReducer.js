import {
  OPEN_MODAL_REQUEST,
  OPEN_MODAL_SUCCESS,
  OPEN_MODAL_FAILURE,
  CLOSE_MODAL_REQUEST,
  CLOSE_MODAL_SUCCESS,
  CLOSE_MODAL_FAILURE,
} from "../actionTypes/modalActionTypes";

const initialState = {
  isOpen: false,
  isLoading: false,
  error: null,
};

const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case "persist/REHYDRATE":
      return { ...state, isOpen: false };
    case OPEN_MODAL_REQUEST:
      return { ...state, isLoading: true, error: null };
    case OPEN_MODAL_SUCCESS:
      return { ...state, isOpen: true, isLoading: false };
    case OPEN_MODAL_FAILURE:
      return { ...state, isLoading: false, error: action.payload };
    case CLOSE_MODAL_REQUEST:
      return { ...state, isLoading: true, error: null };
    case CLOSE_MODAL_SUCCESS:
      return { ...state, isOpen: false, isLoading: false };
    case CLOSE_MODAL_FAILURE:
      return { ...state, isLoading: false, error: action.payload };

    default:
      return state;
  }
};

export default modalReducer;
