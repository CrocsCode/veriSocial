use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct Response<T> {
    pub status: String,
    pub message: T,
}

#[derive(Deserialize, Serialize)]
pub enum ApiError {
    DatabaseCannotInitialise(String),
}