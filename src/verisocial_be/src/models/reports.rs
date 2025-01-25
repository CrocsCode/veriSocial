use sqlx::MySqlPool;
use chrono::NaiveDateTime;
use uuid::Uuid;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug)]
pub struct Report {
    pub reportid: String,
    pub userid: String,
    pub postid: Option<String>,
    pub community_score: u16,
}