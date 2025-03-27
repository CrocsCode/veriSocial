use sqlx::MySqlPool;
use crate::models::response::ApiError;


pub async fn toggle_like(conn: &MySqlPool, post_id: u64, user_id: u64) -> Result<(), ApiError> {
    let exist_like = sqlx::query!(
        r#"
        SELECT user_id FROM likes WHERE post_id = ? AND user_id = ?
        "#,
        post_id,
        user_id
    )
    .fetch_optional(conn)
    .await;

    match exist_like {
        // Like exist (remove like)
        Ok(Some(_)) => remove_like(conn, post_id, user_id).await,
        // Like does not exist (add like)
        Ok(None) => insert_like(conn, post_id, user_id).await,
        Err(_) => Err(ApiError::ServerError)
    }
}

async fn insert_like(conn: &MySqlPool, post_id: u64, user_id: u64) -> Result<(), ApiError>{
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

async fn remove_like(conn: &MySqlPool, post_id: u64, user_id: u64) -> Result<(), ApiError> {
    let delete_result = sqlx::query!(
        r#"
        DELETE FROM likes
        WHERE post_id = ? AND user_id = ?
        "#,
        post_id,
        user_id
    )
    .execute(conn)
    .await;

    match delete_result {
        Ok(_) => Ok(()),
        Err(err) => Err(ApiError::UpdateError("Unable to unlike the post: ".to_string() + &err.to_string()))
    }
}