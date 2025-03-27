import { requests } from "./axiosInstance";

const postInteractService = {
  likePost: (postId) => requests.post("/posts/like", { post_id: postId }),
};

export default postInteractService;
