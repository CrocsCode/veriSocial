use sqlx::MySqlPool;
use crate::models::{posts::LikeEvent, response::ApiError};


pub async fn toggle_like(conn: &MySqlPool, user_id: u64, event: LikeEvent) -> Result<u16, ApiError> {
    let post_id = &event.post_id;
    let comment_id = event.comment_id;

    let exist_like = if let Some(cid) = comment_id {
        sqlx::query_scalar!(
            r#"
            SELECT like_id FROM likes WHERE post_id = ? AND user_id = ? AND comment_id = ?
            "#,
            post_id,
            user_id,
            cid
        )
        .fetch_optional(conn)
        .await
    } else {
        sqlx::query_scalar!(
            r#"
            SELECT like_id FROM likes WHERE post_id = ? AND user_id = ? AND comment_id IS NULL
            "#,
            post_id,
            user_id
        )
        .fetch_optional(conn)
        .await
    };

    match exist_like {
        // Like exist (remove like)
        Ok(Some(_)) => remove_like(conn, post_id, user_id, comment_id).await,
        // Like does not exist (add like)
        Ok(None) => insert_like(conn, post_id, user_id, comment_id).await,
        Err(err) => Err(ApiError::ServerError(err.to_string()))
    }
}

async fn insert_like(conn: &MySqlPool, post_id: &u64, user_id: u64, comment_id: Option<u64>) -> Result<u16, ApiError>{
    let insert_result = sqlx::query!(
        r#"
        INSERT INTO likes (post_id, user_id, comment_id)
        VALUES (?, ?, ?)
        "#,
        post_id,
        user_id,
        comment_id
    )
    .execute(conn)
    .await;

    match insert_result {
        Ok(_) => Ok(1),
        Err(err) => Err(ApiError::UpdateError("Unable to like the post: ".to_string() + &err.to_string()))
    }
}

async fn remove_like(conn: &MySqlPool, post_id: &u64, user_id: u64, comment_id: Option<u64>) -> Result<u16, ApiError> {
    
    let delete_result = if let Some(cid) = comment_id {
        sqlx::query!(
            r#"
            DELETE FROM likes
            WHERE post_id = ? AND user_id = ? AND comment_id = ?
            "#,
            post_id,
            user_id,
            cid
        )
        .execute(conn)
        .await
    } else {
        sqlx::query!(
            r#"
            DELETE FROM likes
            WHERE post_id = ? AND user_id = ? AND comment_id IS NULL
            "#,
            post_id,
            user_id
        )
        .execute(conn)
        .await
    };

    match delete_result {
        Ok(_) => Ok(0),
        Err(err) => Err(ApiError::UpdateError("Unable to unlike the post: ".to_string() + &err.to_string()))
    }
}