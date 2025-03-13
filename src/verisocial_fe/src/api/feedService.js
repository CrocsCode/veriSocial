import { requests } from "./axiosInstance";

const feedService = {
  getPosts: (page, pageSize) => requests.get(`/posts/user?page=${page}&size=${pageSize}`),
};


export default feedService;
