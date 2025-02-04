import { SHOW_NOTIFICATION_SUCCESS } from "../actionTypes/notificationActionTypes";

const initialState = {
    message: "",
    status: "",
};

const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_NOTIFICATION_SUCCESS:
            return {
                message: action.payload.message,
                status: action.payload.status,
            };

        default:
            return state;
    }
};

export default notificationReducer;
