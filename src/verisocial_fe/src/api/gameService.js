import { requests } from "./axiosInstance";

const gameService = {
  getGameEvent: () => requests.get(`/posts/game`),
};

export default gameService;
