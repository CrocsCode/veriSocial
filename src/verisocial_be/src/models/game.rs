use serde::{Deserialize, Serialize};
use super::posts;

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

#[derive(Deserialize, Serialize, Debug)]
pub struct UserRank {
    pub user_id: u64,
    pub correct_count: u64,
    pub position: u64
}

#[derive(Deserialize, Serialize)]
pub struct GamePost {
    pub low_score_post: posts::SendPost,
    pub high_score_post: posts::SendPost,
}