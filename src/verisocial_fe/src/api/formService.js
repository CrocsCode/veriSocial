import { requests } from "./axiosInstance";

const formService = {
    createPost: (userId, postData) => requests.post(`/posts/${userId}`, postData)
};

export default formService;
