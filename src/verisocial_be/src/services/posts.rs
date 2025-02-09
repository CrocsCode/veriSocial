use sqlx::MySqlPool;
use crate::models::{
    response::ApiError,
    posts::{NewPost, Post}
};

/// TODO:
/// Read Singular Post
/// Create Post
/// Delete Post
/// Update Post

pub async fn create_post(conn: &MySqlPool, new_post: NewPost) -> Result<Post, ApiError> {
    let insert_result = sqlx::query!(
        r#"
        INSERT INTO posts (user_id, content)
        VALUES (?, ?)
        "#,
        &new_post.user_id,
        &new_post.content
    )
    .execute(conn)
    .await;

    let latest_post_id = match insert_result {
        Ok(query) => query.last_insert_id(),
        Err(err) => return Err(ApiError::CannotCreateObject(err.to_string()))
    };

    let post_result = sqlx::query_as!(Post,
        r#"
        SELECT 
            p.post_id,
            p.content,
            p.created_at,
            u.user_id,
            u.username,
            u.full_name
        FROM 
            posts AS p
        INNER JOIN
            users AS u ON p.user_id = u.user_id
        WHERE 
            p.post_id = ?;
        "#,
        latest_post_id
    ).fetch_one(conn)
    .await;

    match post_result {
        Ok(post) => Ok(post),
        Err(err) => Err(ApiError::CannotCreateObject(err.to_string()))
    }
}

pub async fn user_timeline(conn: &MySqlPool) -> Result<Vec<Post>, ApiError> {
    let query = sqlx::query_as!(Post,
        r#"
        SELECT 
            p.post_id,
            p.content,
            p.created_at,
            u.user_id,
            u.username,
            u.full_name
        FROM 
            posts AS p
        INNER JOIN
            users AS u ON p.user_id = u.user_id
        ORDER BY
            created_at
        "#
    )
    .fetch_all(conn)
    .await;

    match query {
        Ok(posts) => Ok(posts),
        Err(_) => Err(ApiError::ObjectNotFound("User with specified ID can't be found.".to_string()))
    }
}

pub async fn user_following_timeline(conn: &MySqlPool, user_id: u64) -> Result<Vec<Post>, ApiError> {
    let query = sqlx::query_as!(Post,
        r#"
        SELECT
            p.post_id,
            p.user_id,
            p.content,
            p.created_at,
            u.username,
            u.full_name
        FROM
            posts AS p
        INNER JOIN
            users AS u ON p.user_id = u.user_id
        INNER JOIN
            follow f ON p.user_id = f.followee_id
        WHERE
            f.follower_id = ?
        ORDER BY
            created_at
        "#,
        user_id
    )
    .fetch_all(conn)
    .await;

    match query {
        Ok(result) => Ok(result),
        Err(_) => Err(ApiError::ObjectNotFound("User with specified ID can't be found.".to_string()))
    }
}

pub async fn user_posts(conn: &MySqlPool, user_id: u64) -> Result<Vec<Post>, ApiError> {
    let query = sqlx::query_as!(Post,
        r#"
        SELECT 
            p.post_id,
            p.content,
            p.created_at,
            u.user_id,
            u.username,
            u.full_name
        FROM 
            posts AS p
        INNER JOIN
            users AS u ON p.user_id = u.user_id
        WHERE 
            p.user_id = ?;
        "#,
        user_id
    )
    .fetch_all(conn)
    .await;

    match query {
        Ok(posts) => Ok(posts),
        Err(_) => Err(ApiError::ObjectNotFound("User with specified ID can't be found.".to_string()))
    }
}

pub async fn individual_user_post(conn: &MySqlPool, post_id: u64) -> Result<Post, ApiError> {
    // Should include comments. 
    let query = sqlx::query_as!(Post,
        r#"
        SELECT 
            p.post_id,
            p.content,
            p.created_at,
            u.user_id,
            u.username,
            u.full_name
        FROM 
            posts AS p
        INNER JOIN
            users AS u ON p.user_id = u.user_id
        WHERE 
            p.post_id = ?;
        "#,
        post_id
    )
    .fetch_one(conn)
    .await;

    match query {
        Ok(posts) => Ok(posts),
        Err(_) => Err(ApiError::ObjectNotFound("User with specified ID can't be found.".to_string()))
    }
}
