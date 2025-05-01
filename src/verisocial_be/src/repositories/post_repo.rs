#![allow(clippy::too_many_arguments)] // These are needed for specifically this file only
#![allow(clippy::ptr_arg)]

use aws_sdk_s3::Client as s3_client;
use reqwest::Client as req_client;
use log::{debug, error};
use mockall::automock;
use async_trait::async_trait;
use sqlx::{MySqlPool, Transaction};
use crate::models::{
    response::ApiError,
    posts::Post,
    posts::NewPost,
};
use crate::services::image::*;


pub struct PostRepo {}
impl PostRepo {
    pub fn new() -> Self {
        Self {}
    }
}

#[automock]
#[async_trait]
pub trait PostTrait: Send + Sync {
    // Returns post_id of the created post
    async fn create(
        &self,
        conn: &MySqlPool,
        bucket_name: &String,
        aws_endpoint: &String,
        s3_client: &s3_client,
        req_client: &req_client,     
        new_post: NewPost, 
        image_name: Option<String>,
        user_id: u64
    ) -> Result<u64, ApiError>;

    async fn find_all(&self, conn: &MySqlPool, user_id: u64, page_size: u32, offset: u32) -> Result<Vec<Post>, ApiError>;

    async fn find_user_post(&self, conn: &MySqlPool, user_id: u64, post_id: u64) -> Result<Post, ApiError>;

    async fn find_posts_for_user(&self, conn: &MySqlPool, user_id: u64, page_size: u32, offset: u32) -> Result<Vec<Post>, ApiError>;

    async fn find_low_bot_score_post(&self, conn: &MySqlPool, user_id: u64, threshold: f64) -> Result<Post, ApiError>;

    async fn find_high_bot_score_post(&self, conn: &MySqlPool, user_id: u64, threshold: f64) -> Result<Post, ApiError>;
}

#[async_trait]
impl PostTrait for PostRepo {
    // Due to this being only tested for integration tests I've put the logic for uploading and queueing images here.
    async fn create(
        &self,
        conn: &MySqlPool,
        bucket_name: &String,
        aws_endpoint: &String,
        s3_client: &s3_client,
        req_client: &req_client, 
        new_post: NewPost, 
        mut image_name: Option<String>,
        user_id: u64
    ) -> Result<u64, ApiError> {
        let bot_content_filename = image_name.clone();

        let mut tx: Transaction<'_, sqlx::MySql> = match conn.begin().await {
            Ok(tx) => tx,
            Err(err) => return Err(ApiError::ServerError(err.to_string())),
        };

        let result: Result<u64, ApiError> = async {
            // Upload picture to digitalOcean servers. If this fails the transaction reverts
            if let Some(image) = new_post.image {
                debug!("Uploading image");
    
                // Unwrap will not panic due to the previous if let Some handling the cases when there is no image.
                let filename = image_name.unwrap();
                upload_image(&filename, image, bucket_name, s3_client).await?;
                // use the image name as the url for retrieving the image in the front-end.
                image_name = Some(create_image_url(aws_endpoint, bucket_name, &filename))
            }
     
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
    
            // After send send the picture to bot-checker queue.
            let latest_post_id = match insert_result {
                Ok(query) => query.last_insert_id(),
                Err(err) => return Err(ApiError::CannotCreateObject(err.to_string()))
            };
            
            if let Some(name) = bot_content_filename {
                debug!("Queuing post for bot content detection");
                post_check(name, latest_post_id, req_client).await?;
            };

            Ok(latest_post_id)
        }.await;
    
        match result {
            Ok(id) => {
                tx.commit().await.map_err(|e| ApiError::ServerError(e.to_string()))?;
                Ok(id)
            },
            Err(err) => {
                tx.rollback().await.map_err(|rollback_err| ApiError::ServerError(rollback_err.to_string()))?;
                error!("{}", err);
                Err(err)
            }
        }
    }

    // Finds current timeline
    async fn find_all(&self, conn: &MySqlPool, user_id: u64, page_size: u32, offset: u32) -> Result<Vec<Post>, ApiError> {
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
            Err(err) => Err(ApiError::ObjectNotFound(err.to_string()))
        }
    }

    async fn find_user_post(&self, conn: &MySqlPool, user_id: u64, post_id: u64) -> Result<Post, ApiError> {
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
            Err(err) => Err(ApiError::ObjectNotFound(err.to_string()))
        }
    }

    async fn find_posts_for_user(&self, conn: &MySqlPool, user_id: u64, page_size: u32, offset: u32) -> Result<Vec<Post>, ApiError> {
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
            Err(err) => Err(ApiError::ObjectNotFound(err.to_string()))
        }
    }

    async fn find_low_bot_score_post(&self, conn: &MySqlPool, user_id: u64, threshold: f64) -> Result<Post, ApiError> {
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
            threshold
        )
        .fetch_one(conn)
        .await;

        match low_bot_score_query {
            Ok(posts) => Ok(posts),
            Err(err) => Err(ApiError::ObjectNotFound(err.to_string()))
        }
    }

    async fn find_high_bot_score_post(&self, conn: &MySqlPool, user_id: u64, threshold: f64) -> Result<Post, ApiError> {
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
            threshold
        )
        .fetch_one(conn)
        .await;

        match high_bot_score_query {
            Ok(post) => Ok(post),
            Err(err) => return Err(ApiError::CannotUpload(err.to_string()))
        }
    }
}