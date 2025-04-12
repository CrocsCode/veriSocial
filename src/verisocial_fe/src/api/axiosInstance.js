import axios from "axios";
import { logout } from "../redux/actionCreators/authCreators";
const API_URL = import.meta.env.VITE_API_BASE_URL;

let authToken = null;
let logoutHandler = () => {};

export const setLogoutHandler = (handler) => {
  logoutHandler = handler;
};

export const setAuthToken = (token) => {
  authToken = token;
};

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

function removeExtraQuotes(str) {
  if (typeof str === "string" && str.startsWith('"') && str.endsWith('"')) {
    return str.slice(1, -1);
  }
  return str;
}

axiosInstance.interceptors.request.use(
  (config) => {
    if (!authToken) {
      const persistedAuth = localStorage.getItem("persist:auth");
      if (persistedAuth) {
        try {
          const parsedAuth = JSON.parse(persistedAuth);
          if (parsedAuth.token) {
            authToken = removeExtraQuotes(parsedAuth.token);
          }
        } catch (e) {
          console.error("Error parsing persisted auth state:", e);
        }
      }
    }
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error && error.code === 401) {
      logoutHandler(logout());
    }
    else if (error && error.code === "ERR_NETWORK") {
      logoutHandler(logout());
    }
    return Promise.reject(error);
  }
);

const responseBody = (response) => response.data;

const requests = {
  get: (url, params) => axiosInstance.get(url, { params }).then(responseBody),
  post: (url, body) => axiosInstance.post(url, body).then(responseBody),
  put: (url, body) => axiosInstance.put(url, body).then(responseBody),
  del: (url) => axiosInstance.delete(url).then(responseBody),
};

export { axiosInstance, requests };
