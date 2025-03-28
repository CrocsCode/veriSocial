use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

// Store binary data in file, store name of file in DB.
#[derive(Deserialize, Serialize, sqlx::FromRow, Debug)]
pub struct Post {
    pub post_id: u64,
    #[serde(rename = "user-id")]
    pub user_id: u128,
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
pub struct NewPost {
    // I may not need the following.
    #[serde(rename = "user-id")]
    pub user_id: u64,
    // Could be passed as part of the URI (for the username or user_id)
    pub content: String,
    pub base64_image: Option<String>
}

#[derive(Deserialize, Serialize, Debug)]
pub struct NewComment {
    pub post_id: u64,
    // Could be passed as part of the URI (for the username or user_id)
    pub content: String,
}

#[derive(Deserialize, Serialize)]
pub struct LikeEvent {
    pub post_id: u64,
    pub comment_id: Option<u64>
}