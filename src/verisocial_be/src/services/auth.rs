use jsonwebtoken::{encode, Header, EncodingKey};
use chrono::{Utc, Duration};

use crate::models::auth::Claims;
use crate::config::settings::SECRET;

pub fn generate_jwt(user_id: &u64) -> String {
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

