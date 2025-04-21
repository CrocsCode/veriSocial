use sqlx::MySqlPool;
use crate::models::{
    posts::Post,
    response::ApiError
};


pub async fn individual_game_post(conn: &MySqlPool, user_id: u64) -> Result<Post, ApiError> {
    let bot_score: f64 = 0.7;

    // Finds the post with less than that specified bot-score
    let query = sqlx::query_as!(Post,
        r#"
        SELECT 
            p.post_id,
            p.content,
            p.created_at,
            p.base64_image,
            p.bot_score,
            u.user_id,
            u.username,
            u.full_name,
            u.bot_score AS user_bot_score,
            CAST(COUNT(c.user_id) AS UNSIGNED) AS comment_count,
            CAST(COUNT(l.user_id) AS UNSIGNED) AS likes_count,
            MAX(l.user_id = ?) > 0 AS is_liked
        FROM 
            posts AS p
        INNER JOIN
            users AS u ON p.user_id = u.user_id
        LEFT JOIN 
            likes AS l ON p.post_id = l.post_id AND l.comment_id IS NULL
        LEFT JOIN
            comments AS c ON c.post_id = p.post_id
        WHERE 
            p.bot_score > ?
        GROUP BY 
            p.post_id,
            p.content,
            p.created_at,
            p.base64_image,
            p.bot_score,
            p.user_id,
            u.username,
            u.full_name
        "#,
        user_id,
        bot_score
    )
    .fetch_one(conn)
    .await;

    match query {
        Ok(posts) => Ok(posts),
        Err(_) => Err(ApiError::ObjectNotFound("No post with that bot score found".to_string()))
    }
}