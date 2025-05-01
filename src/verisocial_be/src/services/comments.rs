use sqlx::MySqlPool;
use crate::repositories::comment_repo::{CommentRepo, CommentTrait};
use crate::models::{
    posts::{Comment, NewComment}, response::ApiError
};

pub async fn insert_comment(conn: &MySqlPool, user_id: u64, new_comment: NewComment, comment_repo: &CommentRepo) -> Result<Comment, ApiError> {
    let new_comment_id = comment_repo.create(conn, new_comment, user_id).await?;
    comment_repo.find_single_comment(conn, new_comment_id).await
}