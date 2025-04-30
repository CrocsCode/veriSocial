use sqlx::MySqlPool;
use crate::models::{
    response::ApiError,
    reports::{
        NewReport,
        ReportInfo
    }
};
use crate::repositories::report_repo::{ReportRepo, ReportTrait};


pub async fn create_report(conn: &MySqlPool, user_id: u64, report: NewReport, report_repo: &ReportRepo) -> Result<ReportInfo, ApiError> {
    let new_report_id = report_repo.create(conn, report, user_id).await?;
    let new_report = report_repo.find_report(conn, new_report_id).await;
    new_report
}
