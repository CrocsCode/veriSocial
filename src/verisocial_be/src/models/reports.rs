use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};


#[derive(Deserialize, Serialize, Debug)]
pub struct NewReport {
    pub post_id: u64,
    pub ai_content: bool,
    pub bot_behaviour: bool,
    pub other: bool,
    pub additional_details: Option<String> // This can be empty
}


#[derive(Deserialize, Serialize, sqlx::FromRow, Debug)]
pub struct ReportInfo {
    pub report_id: u64,
    pub reportee_id: u64,
    pub reported_id: Option<u64>,
    pub post_id: u64,
    pub ai_content: bool,
    pub bot_behaviour: bool,
    pub other: bool,
    pub additional_details: Option<String>,
    pub created_at: DateTime<Utc>
}