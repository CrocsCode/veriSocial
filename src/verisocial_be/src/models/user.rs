use argon2::{
    password_hash::{rand_core::OsRng, SaltString}, Argon2, PasswordHash, PasswordHasher, PasswordVerifier
};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, sqlx::FromRow, Debug)]
pub struct User {
    pub user_id: u64,
    pub username: String,
    pub email: String,
    #[serde(rename = "password-hash")]
    pub password_hash: String,
    pub full_name: String,
    pub bio: String,
    pub bot_score: u8,
    #[serde(rename = "created-at")]
    pub created_at: DateTime<Utc>,
}

#[derive(Deserialize, Serialize, sqlx::FromRow, Debug)]
pub struct NewUser {
    pub username: String,
    #[serde(rename = "full-name")]
    pub full_name: String,
    pub email: String,
    pub bio: String,
    pub password: String,
    #[serde(rename = "bot-score")]
    pub bot_score: u16, // Should be zero as default
}

#[derive(Deserialize, Serialize, Debug)]
pub struct FollowRequest {
    pub followee_id: u64,
    pub follower_id: u64,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct AuthDetails {
    pub email: String,
    pub password: String,
}

/// Testing
/// {
///     username: "crocodile07",
///     full_name: "Javier",
///     email: "javifb02@gmail.com",
///     bio: "Just looking to toot in life",
///     password: "IamNotSecure",
///     bot-score: 0,
/// }


impl User {
    pub fn create_password_hash(password: &String, argon2: &Argon2) -> String {   
        // Password hashing function
        let salt = SaltString::generate(&mut OsRng);
        let hash = argon2.hash_password(password.as_bytes(), &salt).unwrap(); // TODO: Need to remove this later

        hash.to_string()
    }

    pub fn verify_password(&self, password: &String, argon2: &Argon2) -> bool {
        let parsed_hash = PasswordHash::new(&self.password_hash);

        let res = match parsed_hash {
            Ok(hash) => hash,
            Err(err)  => {
                println!("{}", err.to_string());
                std::process::exit(1)
            }, // NEEDS TO BE FIXED
        };

        PasswordVerifier::verify_password(argon2, password.as_bytes(), &res).is_ok()
    }
}