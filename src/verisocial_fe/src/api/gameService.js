import { requests } from "./axiosInstance";

const gameService = {
  getGameEvent: () => requests.get(`/game`),
  addGameResult: (result) => requests.post('/game/add_event', result),
  getGameEventList: () => requests.get('/game/game_events'),
};

export default gameService;
