use log::debug;
use sqlx::MySqlPool;
use uuid::Uuid;
use crate::config::settings;
use crate::models::posts::SendPost;
use crate::models::{
    app_config::AppConfig,
    posts::NewPost,
    response::ApiError
};
use crate::repositories::post_repo::{PostRepo, PostTrait};


pub async fn create_post(new_post: NewPost, app_config: &AppConfig<'_>, user_id: u64, post_repo: &PostRepo) -> Result<SendPost, ApiError> {
    let max_file_size = *settings::MAX_FILE_SIZE;

    // Check if there is an image and ensure it's the right format.
    let image_name = if let Some(file) = &new_post.image {    
        debug!("Image detected!");
        let mut file_name = file.file_name.clone().unwrap_or("null".to_string());
        // Check correct filetypes (Could use Tempfile attributes.)
        match &file_name[file_name.len() - 4 ..] {
            ".png" | ".jpg" => {},
            _ => {
                return Err(ApiError::CannotUpload("Invalid File type".to_string()))
            }
        }
        // Check correct size
        match file.size {
            0 => {
                return Err(ApiError::CannotUpload(" Invalid File type".to_owned()))
            },
            length if length > max_file_size as usize => {
                return Err(ApiError::CannotUpload(" File Too Big".to_owned()))

            },
            _ => {}
        }
        // Generate file name.
        file_name = format!("{}-{}.{}",
            user_id,
            Uuid::new_v4(),
            &file_name[file_name.len() - 3 ..]
        );
        
        Some(file_name)
    } else {
        None
    };

    let post_id = post_repo.create(
        &app_config.pool,
        &app_config.bucket_name,
        &app_config.aws_endpoint,
        &app_config.s3_client,
        &app_config.client,
        new_post,
        image_name,
        user_id
    ).await?;

    let created_post = post_repo.find_user_post(&app_config.pool, user_id, post_id).await?;

    Ok(created_post)
}

pub async fn user_timeline(conn: &MySqlPool, user_id: u64, page_size: u32, offset: u32, post_repo: &PostRepo) -> Result<Vec<SendPost>, ApiError> {
    let timeline = post_repo.find_all(conn, user_id, page_size, offset).await?;
    Ok(timeline)
}

pub async fn user_posts(conn: &MySqlPool, user_id: u64, page_size: u32, offset: u32, post_repo: &PostRepo) -> Result<Vec<SendPost>, ApiError> {
    let user_posts = post_repo.find_posts_for_user(conn, user_id, page_size, offset).await?;
    Ok(user_posts)
}

pub async fn individual_user_post(conn: &MySqlPool, user_id: u64, post_id: u64, post_repo: &PostRepo) -> Result<SendPost, ApiError> {
    let post = post_repo.find_user_post(conn, user_id, post_id).await?;
    Ok(post)
}
