use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use actix_multipart::form::{
    tempfile::TempFile, text::Text, MultipartForm
};

// Store image in DigitalOcean sace, store url in DB.
#[derive(Deserialize, Serialize, sqlx::FromRow, Debug)]
pub struct Post {
    pub post_id: u64,
    #[serde(rename = "user-id")]
    pub user_id: u128,
    pub user_bot_score: f32,
    pub username: String,
    #[serde(rename = "full-name")]
    pub full_name: String,
    pub content: String,
    pub base64_image: Option<String>,
    #[serde(rename = "created-at")]
    pub created_at: DateTime<Utc>,
    #[serde(rename = "comment-count")]
    pub comment_count: u64,
    #[serde(rename = "likes-count")]
    pub likes_count: u64,
    #[serde(rename = "is-liked")]
    pub is_liked: Option<i64>,
    pub text_bot_score: f32,
    pub image_bot_score: f32,
    #[serde(rename = "bot-score")]
    pub bot_score: f32
}

// Store image in DigitalOcean sace, store url in DB.
#[derive(Deserialize, Serialize, sqlx::FromRow, Debug)]
pub struct SendPost {
    pub post_id: u64,
    #[serde(rename = "user-id")]
    pub user_id: u128,
    pub user_bot_score: f32,
    pub username: String,
    #[serde(rename = "full-name")]
    pub full_name: String,
    pub content: String,
    pub base64_image: Option<String>,
    #[serde(rename = "created-at")]
    pub created_at: DateTime<Utc>,
    #[serde(rename = "comment-count")]
    pub comment_count: u64,
    #[serde(rename = "likes-count")]
    pub likes_count: u64,
    #[serde(rename = "is-liked")]
    pub is_liked: Option<i64>,
    #[serde(rename = "bot-score")]
    pub bot_score: f32
}


// Change to be part of multipart-uploads.
#[derive(Debug, MultipartForm)]
pub struct NewPost {
    pub content: Text<String>,
    pub image: Option<TempFile>
}

#[derive(Deserialize, Serialize, sqlx::FromRow, Debug)]
pub struct Comment {
    #[serde(rename = "comment-id")]
    pub comment_id: u64,
    pub post_id: u64,
    #[serde(rename = "user-id")]
    pub user_id: u128,
    pub username: String,
    #[serde(rename = "full-name")]
    pub full_name: String,
    pub content: String,
    #[serde(rename = "created-at")]
    pub created_at: DateTime<Utc>,
    #[serde(rename = "likes-count")]
    pub likes_count: u64,
    #[serde(rename = "is-liked")]
    pub is_liked: Option<i64>,
    #[serde(rename = "bot-score")]
    pub bot_score: f32
}

#[derive(Deserialize, Serialize, Debug)]
pub struct NewComment {
    pub post_id: u64,
    // Could be passed as part of the URI (for the username or user_id)
    pub content: String,
}

#[derive(Deserialize, Serialize, sqlx::FromRow, Debug)]
pub struct GameEvent {
    pub event_id: u64,
    pub user_id: u64,
    pub correct_post_id: u64,
    pub wrong_post_id: u64,
    pub is_correct: bool
}

#[derive(Deserialize, Serialize, Debug)]
pub struct IncomingEvent {
    pub result: bool,
    pub correct_post_id: u64,
    pub wrong_post_id: u64
}

#[derive(Deserialize, Serialize, Debug)]
pub struct SendGameEvent {
    pub event_id: u64,
    pub user_id: u64,
    pub correct_image_url: Option<String>, //Only optional for SQLX to easily convert between post and event
    pub wrong_image_url: Option<String>,
    pub is_correct: bool
}

#[derive(Deserialize, Serialize)]
pub struct GamePost {
    pub low_score_post: SendPost,
    pub high_score_post: SendPost,
}

#[derive(Deserialize, Serialize)]
pub struct LikeEvent {
    pub post_id: u64,
    pub comment_id: Option<u64>
}