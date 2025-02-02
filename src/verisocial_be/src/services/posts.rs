use sqlx::MySqlPool;
use crate::models::{
    response::ApiError,
    posts::{NewPost, Post}
};

/// TODO: 
/// timeline
/// FyP
/// Read Singular Post
/// Create Post
/// Delete Post
/// Update Post

pub async fn create_post(conn: &MySqlPool, new_post: NewPost) -> Result<Post, ApiError> {
    let insert_result = sqlx::query!(
        r#"
        INSERT INTO posts (user_id, full_name, username, content)
        VALUES (?, ?, ?, ?)
        "#,
        &new_post.user_id,
        &new_post.full_name,
        &new_post.username,
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
        SELECT * FROM posts WHERE id = ?;
        "#,
        latest_post_id
    ).fetch_one(conn)
    .await;

    match post_result {
        Ok(post) => Ok(post),
        Err(err) => Err(ApiError::CannotCreateObject(err.to_string()))
    }
}

// TODO:
// pub async fn user_timeline(conn: &MySqlPool, username: String) -> () {}

pub async fn user_posts(conn: &MySqlPool, username: String) -> Result<Vec<Post>, ApiError> {
    let query = sqlx::query_as!(Post,
        "
        SELECT * FROM posts
        WHERE username = ?
        ORDER BY created_at DESC
        ",
        username
    )
    .fetch_all(conn)
    .await;

    match query {
        Ok(posts) => Ok(posts),
        Err(_) => Err(ApiError::ObjectNotFound)
    }
}

pub async fn individual_user_post(conn: &MySqlPool, post_id: u64) -> Result<Post, ApiError> {
    let query = sqlx::query_as!(Post,
        "
        SELECT * FROM posts
        WHERE id = ?
        ",
        post_id
    )
    .fetch_one(conn)
    .await;

    match query {
        Ok(posts) => Ok(posts),
        Err(_) => Err(ApiError::ObjectNotFound)
    }
}
