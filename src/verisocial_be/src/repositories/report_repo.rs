use mockall::automock;
use async_trait::async_trait;
use sqlx::MySqlPool;
use crate::models::{
    reports::{ReportInfo, NewReport},
    response::ApiError,
};


pub struct ReportRepo {}
impl ReportRepo {
    pub fn new() -> Self {
        Self {}
    }
}

#[automock]
#[async_trait]
pub trait ReportTrait: Send + Sync {
    async fn create(&self, conn: &MySqlPool, new_report: NewReport, user_id: u64) -> Result<u64, ApiError>;

    async fn find_report(&self, conn: &MySqlPool, report_id: u64) -> Result<ReportInfo, ApiError>;

    async fn list_reports(&self, conn: &MySqlPool) -> Result<Vec<ReportInfo>, ApiError>;
}

#[async_trait]
impl ReportTrait for ReportRepo {
    async fn create(&self, conn: &MySqlPool, new_report: NewReport, user_id: u64) -> Result<u64, ApiError> {
        let new_report = sqlx::query!(
            r#"
            INSERT INTO reports (user_id, post_id, ai_content, bot_behaviour, other, additional_details)
            VALUES (?, ?, ?, ?, ?, ?)
            "#,
            user_id,
            new_report.post_id,
            new_report.ai_content,
            new_report.bot_behaviour,
            new_report.other,
            new_report.additional_details
        )
        .execute(conn)
        .await;
    
        match new_report {
            Ok(query) => Ok(query.last_insert_id()),
            Err(err) => Err(ApiError::CannotCreateObject(err.to_string()))
        }
    }

    async fn find_report(&self, conn: &MySqlPool, report_id: u64) -> Result<ReportInfo, ApiError> {
        let report_query = sqlx::query_as!(ReportInfo,
            r#"
            SELECT
                r.report_id,
                r.user_id AS reportee_id,
                p.user_id AS reported_id,
                r.post_id,
                r.ai_content AS `ai_content: bool`,
                r.bot_behaviour AS `bot_behaviour: bool`,
                r.other AS `other: bool`,
                r.additional_details,
                r.created_at
            FROM
                reports AS r
            LEFT JOIN
                posts AS p ON r.post_id = p.post_id
            WHERE
                r.report_id = ?;
            "#,
            report_id
        )
        .fetch_one(conn)
        .await;
    
        match report_query {
            Ok(reports ) => Ok(reports),
            Err(err) => Err(ApiError::CannotUpload(err.to_string()))
        }
    }

    async fn list_reports(&self, conn: &MySqlPool) -> Result<Vec<ReportInfo>, ApiError> {
        let report_query = sqlx::query_as!(ReportInfo,
            r#"
            SELECT
                r.report_id,
                r.user_id AS reportee_id,
                p.user_id AS reported_id,
                r.post_id,
                r.ai_content AS `ai_content: bool`,
                r.bot_behaviour AS `bot_behaviour: bool`,
                r.other AS `other: bool`,
                r.additional_details,
                r.created_at
            FROM
                reports AS r
            LEFT JOIN
                posts AS p ON r.post_id = p.post_id
            "#
        )
        .fetch_all(conn)
        .await;
    
        match report_query {
            Ok(reports ) => Ok(reports),
            Err(err) => Err(ApiError::CannotUpload(err.to_string()))
        }
    }
}