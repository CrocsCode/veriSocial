use sqlx::MySqlPool;
use crate::models::{
    posts::{
        GameEvent,
        Post,
        IncomingEvent,
        GamePost,
        SendGameEvent
    },
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

pub async fn new_game_event(conn: &MySqlPool, event: IncomingEvent, user_id: u64) -> Result<GameEvent, ApiError> {
    
    let new_game_event = sqlx::query!(
        r#"
        INSERT INTO gameEvents (user_id, correct_post_id, wrong_post_id, is_correct)
        VALUES (?, ?, ?, ?)
        "#,
        user_id,
        event.correct_post_id,
        event.wrong_post_id,
        event.result
    )
    .execute(conn)
    .await;

    let latest_event_id = match new_game_event {
        Ok(query) => query.last_insert_id(),
        Err(err) => return Err(ApiError::CannotCreateObject(err.to_string()))
    };

    let game_event = sqlx::query_as!(GameEvent,
        r#"
        SELECT
            g.event_id,
            g.user_id,
            g.correct_post_id,
            g.wrong_post_id,
            g.is_correct AS `is_correct: bool`
        FROM
            gameEvents AS g
        WHERE
            g.event_id = ?;
        "#,
        latest_event_id
    ).fetch_one(conn)
    .await;

    match game_event {
        Ok(game_event) => Ok(game_event),
        Err(err) => Err(ApiError::ServerError(err.to_string()))
    }
}

pub async fn user_game_event_list(conn: &MySqlPool, user_id: u64) -> Result<Vec<SendGameEvent>, ApiError> {

    let event_query = sqlx::query_as!(SendGameEvent,
        r#"
        SELECT
            g.event_id,
            g.user_id,
            p_correct.base64_image AS correct_image_url,
            p_wrong.base64_image AS wrong_image_url,
            g.is_correct AS `is_correct: bool`
        FROM
            gameEvents AS g
        LEFT JOIN
            posts AS p_correct ON g.correct_post_id = p_correct.post_id
        LEFT JOIN
            posts AS p_wrong ON g.wrong_post_id = p_wrong.post_id
        WHERE
            g.user_id = ?
        "#,
        user_id
    )
    .fetch_all(conn)
    .await;

    match event_query {
        Ok(events) => Ok(events),
        Err(_) => Err(ApiError::ObjectNotFound("User with specified ID can't be found for events.".to_string()))
    }
}