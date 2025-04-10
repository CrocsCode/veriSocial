use reqwest::Client;
use serde_json::json;
use uuid::Uuid;

use crate::models::response::{ApiError, ImageResponse};
use crate::config::settings::AI_IMAGE_URL;


pub async fn image_check(image_name: String, post_id: u64, client: &Client) -> Result<ImageResponse, ApiError> {
    // Build response
    let payload = json!({
        "post_id": post_id,
        "image_name": image_name
    });

    let resp = client.post(AI_IMAGE_URL.clone())
        .json(&payload)
        .send()
        .await;

    let succ_resp = match resp {
        Ok(json) => json.json::<ImageResponse>().await,
        Err(err) => return Err(ApiError::CannotUpload("Image Verification failed: ".to_string() + &err.to_string()))
    };

    match succ_resp {
        Ok(result) => Ok(result),
        Err(err) => Err(ApiError::CannotUpload("Error: ".to_string() + &err.to_string()))
    }
}

pub async fn upload_image<T>() -> Result<T, ApiError> {
    todo!()
}