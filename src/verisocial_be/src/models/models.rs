use sqlx::MySqlPool;
use chrono::NaiveDateTime;
use uuid::Uuid;
use serde::{Deserialize, Serialize};

#[derive(Clone)]
pub struct AppState {
    pub conn_pool: MySqlPool
}

#[derive(Deserialize, Serialize, Debug)]
pub struct User {
    pub id: usize,
    pub uuid: Uuid,
    pub username: String,
    pub name: String,
    pub email: String,
    pub bio: String,
    #[serde(rename = "password-hash")]
    pub password_hash: String,
    #[serde(rename = "bot-score")]
    pub botscore: u16,
    #[serde(rename = "created-at")]
    pub created_at: NaiveDateTime,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Post {
    pub uuid: Uuid,
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

#[derive(Deserialize, Serialize, Debug)]
pub struct Report {
    pub reportid: String,
    pub userid: String,
    pub postid: Option<String>,
    pub community_score: u16,
}