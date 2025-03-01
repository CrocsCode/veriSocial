use argon2::Argon2;
use sqlx::MySqlPool;
use serde::Deserialize;

#[derive(Clone)]
pub struct AppState<'a> {
    pub pass_hashing: Argon2<'a>,
    pub pool: MySqlPool
}

#[derive(Deserialize)]
pub struct Pagination {
    pub page: Option<u32>,
    pub size: Option<u32>
}