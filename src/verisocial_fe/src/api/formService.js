import { requests } from "./axiosInstance";

const formService = {
  createMultipartPost: (userId, postData) => requests.postMultiform(`/posts/${userId}`, postData),
};

export default formService;
