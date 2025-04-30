use sqlx::MySqlPool;
use crate::{models::{
    posts::{
        GameEvent, GamePost, IncomingEvent},
    response::ApiError
}, 
    repositories::{
        post_repo::{PostRepo, PostTrait},
        game_event_repo::{GameEventRepo, GameEventTrait}
    }
};


pub async fn individual_game_post(conn: &MySqlPool, user_id: u64, post_repo: &PostRepo) -> Result<GamePost, ApiError> {
    let low_bot_score_threshold: f64 = 0.4;
    let high_bot_score_threshold: f64 = 0.7;

    let low_score_post = post_repo.find_low_bot_score_post(conn, user_id, low_bot_score_threshold).await?;
    let high_score_post = post_repo.find_high_bot_score_post(conn, user_id, high_bot_score_threshold).await?;

    Ok(GamePost {
        low_score_post,
        high_score_post
    })
}

pub async fn new_game_event(conn: &MySqlPool, new_event: IncomingEvent, user_id: u64, game_event_repo: &GameEventRepo) -> Result<GameEvent, ApiError> {
    let new_game_id = game_event_repo.create(conn, new_event, user_id).await?;
    game_event_repo.find_game_event(conn, new_game_id).await
}