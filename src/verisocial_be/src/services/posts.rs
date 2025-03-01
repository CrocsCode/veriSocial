use sqlx::MySqlPool;
// use uuid::Uuid;
// use tokio::fs;

use crate::models::{
    response::ApiError,
    posts::{NewPost, Post}
};


pub async fn create_post(conn: &MySqlPool, new_post: NewPost) -> Result<Post, ApiError> {
    // let filepath = if new_post.base64_image.is_some() {
    //     let data = new_post.base64_image.unwrap(); // Should never happen.
    //     decode_and_generate_image(new_post.user_id, data).await?
    // } else {
    //     "0".to_string()
    // };

    let insert_result = sqlx::query!(
        r#"
        INSERT INTO posts (user_id, content, base64_image)
        VALUES (?, ?, ?)
        "#,
        &new_post.user_id,
        &new_post.content,
        new_post.base64_image
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
            p.base64_image,
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

pub async fn user_timeline(conn: &MySqlPool, page_size: u32, offset: u32) -> Result<Vec<Post>, ApiError> {
    let query = sqlx::query_as!(Post,
        r#"
        SELECT 
            p.post_id,
            p.content,
            p.created_at,
            p.base64_image,
            u.user_id,
            u.username,
            u.full_name
        FROM 
            posts AS p
        INNER JOIN
            users AS u ON p.user_id = u.user_id
        ORDER BY
            created_at
        LIMIT ? OFFSET ?
        "#,
        page_size,
        offset
    )
    .fetch_all(conn)
    .await;

    match query {
        Ok(posts) => Ok(posts),
        Err(_) => Err(ApiError::ObjectNotFound("User with specified ID can't be found.".to_string()))
    }
}

pub async fn user_following_timeline(conn: &MySqlPool, user_id: u64, page_size: u32, offset: u32) -> Result<Vec<Post>, ApiError> {
    let query = sqlx::query_as!(Post,
        r#"
        SELECT
            p.post_id,
            p.user_id,
            p.content,
            p.created_at,
            p.base64_image,
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
        LIMIT ? OFFSET ?
        "#,
        user_id,
        page_size,
        offset
    )
    .fetch_all(conn)
    .await;

    match query {
        Ok(result) => Ok(result),
        Err(_) => Err(ApiError::ObjectNotFound("User with specified ID can't be found.".to_string()))
    }
}

pub async fn user_posts(conn: &MySqlPool, user_id: u64, page_size: u32, offset: u32) -> Result<Vec<Post>, ApiError> {
    let query = sqlx::query_as!(Post,
        r#"
        SELECT 
            p.post_id,
            p.content,
            p.created_at,
            p.base64_image,
            u.user_id,
            u.username,
            u.full_name
        FROM 
            posts AS p
        INNER JOIN
            users AS u ON p.user_id = u.user_id
        WHERE 
            p.user_id = ?
        LIMIT ? OFFSET ?
        "#,
        user_id,
        page_size,
        offset
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
            p.base64_image,
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


// This if for files being created. For deployment
// async fn decode_and_generate_image(user_id: u64, data: String) -> Result<String, ApiError> {
//     let filename = format!("{}-{}",
//         user_id,
//         Uuid::new_v4()
//     );
//     let filepath = format!("./uploads/{}", filename);

//     // Write binary data to uploads folder.
//     if let Err(err) = fs::write(&filepath, &data).await {
//         return Err(ApiError::CannotUpload("Error creating the file: ".to_string() + &err.to_string()))
//     };

//     Ok(filepath)
// }