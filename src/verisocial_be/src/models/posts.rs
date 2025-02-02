use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};


#[derive(Deserialize, Serialize, sqlx::FromRow, Debug)]
pub struct Post {
    pub post_id: u64,
    #[serde(rename = "user-id")]
    pub user_id: u128,
    pub username: String,
    #[serde(rename = "full-name")]
    pub full_name: String,
    pub content: String,
    #[serde(rename = "created-at")]
    pub created_at: DateTime<Utc>,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct NewPost {
    // I may not need the following.
    #[serde(rename = "user-id")]
    pub user_id: u64,
    // Could be passed as part of the URI (for the username or user_id)
    pub content: String,
}