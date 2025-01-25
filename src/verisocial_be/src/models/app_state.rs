use argon2::Argon2;
use sqlx::MySqlPool;

#[derive(Clone)]
pub struct AppState<'a> {
    pub pass_hashing: Argon2<'a>,
    pub pool: MySqlPool
}