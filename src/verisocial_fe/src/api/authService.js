import { requests } from "./axiosInstance";

const authService = {
  register: (userData) => requests.post("/auth/register", userData),
  login: (authDetails) => requests.post("/auth/login", authDetails),
};

export default authService;
