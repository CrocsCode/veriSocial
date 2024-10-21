use serde::{Deserialize, Serialize};


/// User Struct
/// Attributes:
/// - username
/// - name
/// - description
/// - following
/// - followers
#[derive(Deserialize, Serialize, Debug)]
pub struct User {
    username: String,
    name: String,
    description: String,
    following: Vec<User>,
    followers: Vec<User>
}