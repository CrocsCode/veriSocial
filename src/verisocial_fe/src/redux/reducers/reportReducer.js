import { REPORT_LIST_REQUEST, REPORT_LIST_SUCCESS, REPORT_LIST_FAILURE } from '../actionTypes/reportActionTypes';

const initialState = {
    data: [],
    loading: false,
    error: null,
};

const reportReducer = (state = initialState, action) => {
    switch (action.type) {
        case REPORT_LIST_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case REPORT_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
            };
        case REPORT_LIST_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
}

export default reportReducer;