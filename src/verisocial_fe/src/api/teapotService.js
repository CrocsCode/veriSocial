import { requests } from "./axiosInstance";

const TeapotService = {
  getStatus: (params = {}) => requests.get("/iamteapot", params),
};

export default TeapotService;
