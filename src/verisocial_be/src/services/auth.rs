use jsonwebtoken::{encode, Header, EncodingKey};
use serde::{Deserialize, Serialize};
use chrono::{Utc, Duration};

use crate::config::settings::SECRET;
/// TODO:
/// - Encode JWT (by generation)
/// - Decode JWT (Middleware does this)

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Claims {
    sub: String,
    iss: String,
    exp: usize,
}

pub fn generate_jwt(user_id: &String) -> String {
    let expiration = Utc::now()
        .checked_add_signed(Duration::seconds(3600)) // 1 Hour
        .expect("Valid Timestamp") // Look into error solving
        .timestamp() as usize;

    let claims = Claims {
        sub: user_id.to_owned(),
        iss: "http://verisocial-be.com".to_string(),
        exp: expiration,
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(SECRET.as_bytes()),
    ).expect("token encoding failed")
}

