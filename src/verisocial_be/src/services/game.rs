use sqlx::MySqlPool;
use crate::models::{
    posts::Post,
    posts::GamePost,
    response::ApiError
};


pub async fn individual_game_post(conn: &MySqlPool, user_id: u64) -> Result<GamePost, ApiError> {
    let low_bot_score_threshold: f64 = 0.4;
    let high_bot_score_threshold: f64 = 0.7;

    // Finds the post with less than that specified bot-score
    let low_bot_score_query = sqlx::query_as!(Post,
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
            p.bot_score < ?
            AND p.base64_image IS NOT NULL
        GROUP BY 
            p.post_id,
            p.content,
            p.created_at,
            p.base64_image,
            p.bot_score,
            p.user_id,
            u.username,
            u.full_name
        ORDER BY
            RAND()
        "#,
        user_id,
        low_bot_score_threshold
    )
    .fetch_one(conn)
    .await;

    // Order by rand to provide more random posts
    let high_bot_score_query = sqlx::query_as!(Post,
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
            AND p.base64_image IS NOT NULL
        GROUP BY 
            p.post_id,
            p.content,
            p.created_at,
            p.base64_image,
            p.bot_score,
            p.user_id,
            u.username,
            u.full_name
        ORDER BY
            RAND()
        "#,
        user_id,
        high_bot_score_threshold
    )
    .fetch_one(conn)
    .await;

    let low_score_post = match low_bot_score_query {
        Ok(post) => post,
        Err(_) => return Err(ApiError::CannotUpload("No post with low enough bot score".to_string()))
    };

    let high_score_post = match high_bot_score_query {
        Ok(post) => post,
        Err(_) => return Err(ApiError::CannotUpload("No post with high enough bot score".to_string()))
    };

    Ok(GamePost {
        low_score_post,
        high_score_post
    })
}