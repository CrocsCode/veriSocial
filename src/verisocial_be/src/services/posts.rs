use log::info;
use sqlx::{MySqlPool, Transaction};
use uuid::Uuid;
use log::error;
use crate::config::settings;
use crate::models::{
    app_state::AppState,
    posts::{NewPost, Post},
    response::{ApiError, ImageResponse}
};
use super::image::image_check;


pub async fn create_post(new_post: NewPost, app_state: &AppState<'_>, user_id: u64) -> Result<Post, ApiError> {
    let max_file_size = (*settings::MAX_FILE_SIZE).clone();

    let image_name = if let Some(file) = new_post.image {    
        let file_name = file.file_name.clone().unwrap_or("null".to_string());
        // Check correct filetypes
        match &file_name[file_name.len() - 4 ..] {
            ".png" | ".jpg" => {},
            _ => {
                return Err(ApiError::CannotUpload("Invalid File type".to_string()))
            }
        }
        // Check correct size
        match file.size {
            0 => {
                return Err(ApiError::CannotUpload(" Invald File type".to_owned()))
            },
            length if length > max_file_size as usize => {
                return Err(ApiError::CannotUpload(" File Too Big".to_owned()))

            },
            _ => {}
        }
        file_name
    } else {
        "null".to_string()
    };

    // Start a transaction.
    let mut tx: Transaction<'_, sqlx::MySql> = match app_state.pool.begin().await {
        Ok(tx) => tx,
        Err(err) => return Err(ApiError::ServerError(err.to_string())),
    };

    let result: Result<Post, ApiError> = async {
        let insert_result = sqlx::query!(
            r#"
            INSERT INTO posts (user_id, content, base64_image, bot_score)
            VALUES (?, ?, ?, ?)
            "#,
            user_id,
            &new_post.content.to_string(),
            image_name,
            0.0
        )
        .execute(&mut *tx)
        .await;

        // Upload picture to digitalOcean servers.
        // After send send the picture to bot-checker queue.

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
                p.bot_score,
                u.user_id,
                u.username,
                u.full_name,
                u.bot_score AS user_bot_score,
                CAST(0 AS UNSIGNED) AS comment_count,
                CAST(0 AS UNSIGNED) AS likes_count,
                0 AS is_liked
            FROM 
                posts AS p
            INNER JOIN
                users AS u ON p.user_id = u.user_id
            WHERE 
                p.post_id = ?;
            "#,
            latest_post_id
        ).fetch_one(&mut *tx)
        .await
        .map_err(|err|  ApiError::ServerError(err.to_string()))?;

        Ok(post_result)
    }.await;

    match result {
        Ok(post) => {
            tx.commit().await.map_err(|e| ApiError::ServerError(e.to_string()))?;
            Ok(post)
        },
        Err(err) => {
            tx.rollback().await.map_err(|rollback_err| ApiError::ServerError(rollback_err.to_string()))?;
            error!("{}", err);
            Err(err)
        }
    }
}

pub async fn user_timeline(conn: &MySqlPool, user_id: u64, page_size: u32, offset: u32) -> Result<Vec<Post>, ApiError> {
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
            CAST(COUNT(DISTINCT c.user_id) AS UNSIGNED) AS comment_count,
            CAST(COUNT(DISTINCT l.user_id) AS UNSIGNED) AS likes_count,
            MAX(l2.user_id IS NOT NULL) AS is_liked
        FROM
            posts AS p
        INNER JOIN
            users AS u ON p.user_id = u.user_id
        LEFT JOIN 
            likes AS l ON p.post_id = l.post_id AND l.comment_id IS NULL
        LEFT JOIN
            likes AS l2 ON p.post_id = l2.post_id AND l2.user_id = ? AND l2.comment_id IS NULL
        LEFT JOIN
            comments AS c ON c.post_id = p.post_id
        GROUP BY 
            p.post_id,
            p.content,
            p.created_at,
            p.base64_image,
            p.bot_score,
            u.user_id,
            u.username,
            u.full_name,
            l2.user_id
        ORDER BY
            created_at DESC
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

pub async fn user_following_timeline(conn: &MySqlPool, user_id: u64, page_size: u32, offset: u32) -> Result<Vec<Post>, ApiError> {
    let query = sqlx::query_as!(Post,
        r#"
        SELECT
            p.post_id,
            p.user_id,
            p.content,
            p.created_at,
            p.base64_image,
            p.bot_score,
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
        INNER JOIN
            follow f ON p.user_id = f.followee_id
        LEFT JOIN 
            likes AS l ON p.post_id = l.post_id AND l.comment_id IS NULL
        LEFT JOIN
            comments AS c ON c.post_id = p.post_id
        WHERE
            f.follower_id = ?
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
            created_at
        LIMIT ? OFFSET ?
        "#,
        user_id.clone(),
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
            p.user_id = ?
        GROUP BY 
            p.post_id,
            p.content,
            p.created_at,
            p.base64_image,
            p.bot_score,
            p.user_id,
            u.username,
            u.full_name
        LIMIT ? OFFSET ?
        "#,
        user_id.clone(),
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

pub async fn individual_user_post(conn: &MySqlPool, user_id: u64, post_id: u64) -> Result<Post, ApiError> {
    // Should include comments. 
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
            p.post_id = ?
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