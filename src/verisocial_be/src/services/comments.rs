use sqlx::MySqlPool;

use crate::models::{
    app_config::AppConfig, posts::{Comment, NewComment}, response::ApiError
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
            likes AS l ON c.comment_id = l.comment_id AND l.comment_id IS NOT NULL
        LEFT JOIN
            likes AS l2 ON c.comment_id = l2.comment_id AND l2.user_id = ? AND l2.comment_id IS NOT NULL
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

pub async fn insert_comment(app_state: &AppConfig<'_>, user_id: u64, new_comment: NewComment) -> Result<Comment, ApiError> {

    // Check for generated content (Txt not implemented yet so leave empty)

    let insert_result = sqlx::query!(
        r#"
        INSERT INTO comments (post_id, user_id, content, bot_score)
        VALUES (?, ?, ?, ?)
        "#,
        new_comment.post_id,
        user_id,
        new_comment.content,
        0
    )
    .execute(&app_state.pool)
    .await;

    let latest_comment_id = match insert_result {
        Ok(query) => query.last_insert_id(),
        Err(err) => return Err(ApiError::CannotCreateObject(err.to_string()))
    };

    let post_result = sqlx::query_as!(Comment,
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
            CAST(0 AS UNSIGNED) AS likes_count,
            0 AS is_liked
        FROM
            comments AS c
        INNER JOIN
            users AS u ON c.user_id = u.user_id
        WHERE
            c.comment_id = ?;
        "#,
        latest_comment_id  
    )
    .fetch_one(&app_state.pool)
    .await;

    match post_result {
        Ok(comment) => Ok(comment),
        Err(err) => Err(ApiError::ObjectNotFound("Newly Created Object is unable to be found: ".to_string() + &err.to_string()))
    }
}