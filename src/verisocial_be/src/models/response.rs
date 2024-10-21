use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct Response {
    status: String,
    message: String,
}