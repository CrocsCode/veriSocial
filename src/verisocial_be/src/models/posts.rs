use chrono::NaiveDateTime;
use uuid::Uuid;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug)]
pub struct Post {
    pub id: Uuid,
    pub title: String,
    pub content: String,
    #[serde(rename = "user-id")]
    pub user_id: String, // Should be the author's userID
    pub username: String,
    pub name: String,
    #[serde(rename = "bot-score")]
    pub bot_score: u16,
    pub investigated: bool,
    pub likes: u128,
    #[serde(rename = "created-at")]
    pub created_at: NaiveDateTime,
}