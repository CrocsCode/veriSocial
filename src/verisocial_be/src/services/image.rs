use reqwest::Client;
use serde_json::json;

use crate::models::response::{ApiError, ImageResponse};
use crate::config::config::AI_IMAGE_URL;


pub async fn image_check(encoded_image: String, post_id: u64, client: &Client) -> Result<ImageResponse, ApiError> {
    // Build response
    let payload = json!({
        "post_id": post_id,
        "base64_image": encoded_image
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