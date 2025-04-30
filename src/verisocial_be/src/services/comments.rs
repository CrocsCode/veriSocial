use sqlx::MySqlPool;
use crate::repositories::comment_repo::{CommentRepo, CommentTrait};
use crate::models::{
    posts::{Comment, NewComment}, response::ApiError
};


pub async fn retrieve_comments_for_post(
    conn: &MySqlPool,
    post_id: u64,
    user_id: u64,
    page_size: u32,
    offset: u32,
    comment_repo: &CommentRepo
) -> Result<Vec<Comment>, ApiError> {
    let comments = comment_repo.list_comments_for_post(conn, post_id, user_id, page_size, offset).await;
    comments
}

pub async fn insert_comment(conn: &MySqlPool, user_id: u64, new_comment: NewComment, comment_repo: &CommentRepo) -> Result<Comment, ApiError> {
    let new_comment_id = comment_repo.create(conn, new_comment, user_id).await?;
    let new_comment = comment_repo.find_single_comment(conn, new_comment_id).await;
    new_comment
}