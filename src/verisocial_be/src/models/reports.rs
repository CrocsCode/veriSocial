use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};


#[derive(Deserialize, Serialize, sqlx::FromRow, Debug)]
pub struct Report {
    pub report_id: u64,
    pub user_id: u64, // Person who submitted the post
    pub post_id: u64,
    pub ai_content: bool,
    pub bot_behaviour: bool,
    pub other: bool,
    pub additional_details: Option<String>, // This can be empty
    pub created_at: DateTime<Utc>,
}


#[derive(Deserialize, Serialize, Debug)]
pub struct NewReport {
    pub post_id: u64,
    pub ai_content: bool,
    pub bot_behaviour: bool,
    pub other: bool,
    pub additional_details: String // This can be empty
}


#[derive(Deserialize, Serialize, sqlx::FromRow, Debug)]
pub struct ReportInfo {
    pub report_id: u64,
    pub reportee_id: u64,
    pub reported_id: u64,
    pub post_id: u64,
    pub ai_content: bool,
    pub bot_behaviour: bool,
    pub other: bool,
    pub additional_details: Option<String>,
    pub created_at: DateTime<Utc>
}