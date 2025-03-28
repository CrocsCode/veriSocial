use sqlx::MySqlPool;

use crate::models::{
    posts::Comment,
    response::ApiError
};


pub async fn retrieve_comments_for_post(
    conn: &MySqlPool,
    post_id: u64,
    user_id: u64,
    page_size: u32,
    offset: u32
) -> Result<Vec<Comment>, ApiError> {
    let query = sqlx::query_as!(Comment,
        r#"
        SELECT
            c.comment_id,
            c.post_id,
            c.user_id,
            u.username,
            u.full_name,
            c.content,
            c.created_at,
            c.bot_score,
            CAST(COUNT(l.user_id) AS UNSIGNED) AS likes_count,
            MAX(l2.user_id IS NOT NULL) AS is_liked
        FROM
            comments AS c
        INNER JOIN
            users AS u ON c.user_id = u.user_id
        LEFT JOIN
            likes AS l ON l.comment_id = l.comment_id
        LEFT JOIN
            likes AS l2 ON c.comment_id = l2.comment_id AND l2.user_id = ?
        WHERE
            c.post_id = ?
        GROUP BY
            c.comment_id,
            c.post_id,
            c.user_id,
            u.username,
            u.full_name,
            c.content,
            c.created_at,
            c.bot_score
        ORDER BY
            created_at DESC
        LIMIT ? OFFSET ?
        "#,
        user_id,
        post_id,
        page_size,
        offset
    )
    .fetch_all(conn)
    .await;

    match query {
        Ok(result) => Ok(result),
        Err(err) => Err(ApiError::ObjectNotFound("Error retrieving comments: ".to_string() + &err.to_string()))
    }
}