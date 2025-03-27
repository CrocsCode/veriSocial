use sqlx::MySqlPool;

use crate::models::response::ApiError;


pub async fn insert_like(conn: &MySqlPool, post_id: u64, user_id: u64) -> Result<(), ApiError>{
    let insert_result = sqlx::query!(
        r#"
        INSERT INTO likes (post_id, user_id)
        VALUES (?, ?)
        "#,
        post_id,
        user_id
    )
    .execute(conn)
    .await;

    match insert_result {
        Ok(_) => Ok(()),
        Err(err) => Err(ApiError::UpdateError("Unable to like the post: ".to_string() + &err.to_string()))
    }
}