import { requests } from "./axiosInstance";

const postInteractService = {
  likePost: (postId) => requests.post("/posts/like", { post_id: postId }),
  getPostFocus: (userId, postId) => requests.get(`/posts/${userId}/${postId}`)
};

export default postInteractService;
