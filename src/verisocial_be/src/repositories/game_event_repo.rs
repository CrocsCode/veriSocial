use mockall::automock;
use async_trait::async_trait;
use sqlx::MySqlPool;
use crate::models::{
    game::{
        GameEvent,
        IncomingEvent,
        SendGameEvent,
        UserRank
    }, response::ApiError
};


pub struct GameEventRepo {}
impl GameEventRepo {
    pub fn new() -> Self {
        Self{}
    }
}

#[automock]
#[async_trait]
pub trait GameEventTrait: Send + Sync {
    async fn create(&self, conn: &MySqlPool, new_event: IncomingEvent, user_id: u64) -> Result<u64, ApiError>;

    async fn find_game_event(&self, conn: &MySqlPool, game_id: u64) -> Result<GameEvent, ApiError>;

    async fn list_game_events_for_user(&self, conn: &MySqlPool, user_id: u64) -> Result<Vec<SendGameEvent>, ApiError>;

    async fn find_user_ranking(&self, conn: &MySqlPool, user_id: u64) -> Result<Option<UserRank>, ApiError>;

    async fn list_ranking_of_game_event(&self, conn: &MySqlPool) -> Result<Vec<UserRank>, ApiError>;
}

#[async_trait]
impl GameEventTrait for GameEventRepo {
    async fn create(&self, conn: &MySqlPool, new_event: IncomingEvent, user_id: u64) -> Result<u64, ApiError> {
        let new_game_event = sqlx::query!(
            r#"
            INSERT INTO gameEvents (user_id, correct_post_id, wrong_post_id, is_correct)
            VALUES (?, ?, ?, ?)
            "#,
            user_id,
            new_event.correct_post_id,
            new_event.wrong_post_id,
            new_event.result
        )
        .execute(conn)
        .await;
    
        match new_game_event {
            Ok(query) => Ok(query.last_insert_id()),
            Err(err) => Err(ApiError::CannotCreateObject(err.to_string()))
        }
    }

    async fn find_game_event(&self, conn: &MySqlPool, game_id: u64) -> Result<GameEvent, ApiError> {
        let game_event = sqlx::query_as!(GameEvent,
            r#"
            SELECT
                g.event_id,
                g.user_id,
                g.correct_post_id,
                g.wrong_post_id,
                g.is_correct AS `is_correct: bool`
            FROM
                gameEvents AS g
            WHERE
                g.event_id = ?;
            "#,
            game_id
        ).fetch_one(conn)
        .await;
    
        match game_event {
            Ok(game_event) => Ok(game_event),
            Err(err) => Err(ApiError::ServerError(err.to_string()))
        }
    }

    async fn list_game_events_for_user(&self, conn: &MySqlPool, user_id: u64) -> Result<Vec<SendGameEvent>, ApiError> {
        let event_query = sqlx::query_as!(SendGameEvent,
            r#"
            SELECT
                g.event_id,
                g.user_id,
                p_correct.base64_image AS correct_image_url,
                p_wrong.base64_image AS wrong_image_url,
                g.is_correct AS `is_correct: bool`
            FROM
                gameEvents AS g
            LEFT JOIN
                posts AS p_correct ON g.correct_post_id = p_correct.post_id
            LEFT JOIN
                posts AS p_wrong ON g.wrong_post_id = p_wrong.post_id
            WHERE
                g.user_id = ?
            "#,
            user_id
        )
        .fetch_all(conn)
        .await;
    
        match event_query {
            Ok(events) => Ok(events),
            Err(err) => Err(ApiError::ObjectNotFound(err.to_string()))
        }
    }

    async fn find_user_ranking(&self, conn: &MySqlPool, user_id: u64) -> Result<Option<UserRank>, ApiError> {
        let user_rank = sqlx::query_as!(UserRank,
            r#"
            WITH user_rank AS (
                SELECT
                    user_id,
                    COUNT(*) AS signed_correct_count,
                    RANK() OVER (ORDER BY COUNT(*) DESC) AS position
                FROM
                    gameEvents
                WHERE
                    is_correct = TRUE
                GROUP BY
                    user_id
            )
            SELECT
                user_id,
                CAST(signed_correct_count AS UNSIGNED) AS correct_count,
                CAST(
                    RANK() OVER (ORDER BY signed_correct_count DESC)
                    AS UNSIGNED
                ) AS position
            FROM user_rank
            WHERE user_id = ?
            "#,
            user_id
        ).fetch_optional(conn)
        .await;

        match user_rank {
            Ok(rank) => Ok(rank),
            Err(err) => Err(ApiError::ObjectNotFound(err.to_string()))
        }
    }

    async fn list_ranking_of_game_event(&self, conn: &MySqlPool) -> Result<Vec<UserRank>, ApiError> {
        let leaderboard = sqlx::query_as!(UserRank,
            r#"
            WITH user_correct_count AS (
                SELECT
                    user_id,
                    COUNT(*) AS signed_correct_count
                FROM
                    gameEvents
                WHERE
                    is_correct = TRUE
                GROUP BY
                    user_id
            )
            SELECT
                user_id,
                CAST(signed_correct_count AS UNSIGNED) AS correct_count,
                CAST(
                    RANK() OVER (ORDER BY signed_correct_count DESC)
                    AS UNSIGNED
                ) AS position
            FROM
                user_correct_count
            ORDER BY position;
            "#
        )
        .fetch_all(conn)
        .await;

        match leaderboard {
            Ok(leaderboard) => Ok(leaderboard),
            Err(err) => Err(ApiError::ObjectNotFound(err.to_string()))
        }
    }
}