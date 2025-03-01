import axios from "axios";
import store from "../redux/store";
const API_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    let token = state.auth.token;
    if (!token) {
      token = localStorage.getItem("token");
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

const responseBody = (response) => response.data;

const requests = {
  get: (url, params) => axiosInstance.get(url, { params }).then(responseBody),
  post: (url, body) => axiosInstance.post(url, body).then(responseBody),
  put: (url, body) => axiosInstance.put(url, body).then(responseBody),
  del: (url) => axiosInstance.delete(url).then(responseBody),
};

export { axiosInstance, requests };
