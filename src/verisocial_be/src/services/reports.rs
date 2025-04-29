use sqlx::MySqlPool;
use crate::models::{
    response::ApiError,
    reports::{
        Report,
        NewReport,
        ReportInfo
    }
};


pub async fn create_report(conn: &MySqlPool, user_id: u64, report: NewReport) -> Result<Report, ApiError> {

    let new_report = sqlx::query!(
        r#"
        INSERT INTO reports (user_id, post_id, ai_content, bot_behaviour, other, additional_details)
        VALUES (?, ?, ?, ?, ?, ?)
        "#,
        user_id,
        report.post_id,
        report.ai_content,
        report.bot_behaviour,
        report.other,
        report.additional_details
    )
    .execute(conn)
    .await;

    let latest_report_id = match new_report {
        Ok(query) => query.last_insert_id(),
        Err(err) => return Err(ApiError::CannotCreateObject(err.to_string()))
    };

    let completed_report = sqlx::query_as!(Report,
        r#"
        SELECT
            r.report_id,
            r.user_id,
            r.post_id,
            r.ai_content AS `ai_content: bool`,
            r.bot_behaviour AS `bot_behaviour: bool`,
            r.other AS `other: bool`,
            r.additional_details,
            r.created_at
        FROM
            reports AS r
        WHERE
            r.report_id = ?;
        "#,
        latest_report_id
    ).fetch_one(conn)
    .await;

    match completed_report {
        Ok(rep) => Ok(rep),
        Err(err) => Err(ApiError::ServerError(err.to_string()))
    }
}


pub async fn list_reports(conn: &MySqlPool) -> Result<Vec<ReportInfo>, ApiError> {
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