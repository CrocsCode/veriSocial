import { GAME_EVENT_CLEAR } from "../actionTypes/gameActionTypes";

export const clearGameEvent = (gameEventId) => ({
    type: GAME_EVENT_CLEAR,
    payload: { gameEventId },
})
