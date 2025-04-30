import { requests } from "./axiosInstance";

const postInteractService = {
  likePost: (postId, commentId) => requests.post("/posts/like", { post_id: postId, comment_id: commentId }),
  getPostFocus: (userId, postId) => requests.get(`/posts/${userId}/${postId}`),
  getComments: (postId, page, pageSize) => requests.get(`/posts/comments/${postId}?page=${page}&size=${pageSize}`),
  postComment: ({ post_id, content }) => requests.post("/posts/comments", {post_id, content,}),
};

export default postInteractService;
