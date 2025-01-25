use sqlx::MySqlPool;
use argon2::Argon2;
use crate::models::{
    response::ApiError,
    user::{NewUser, User}
};

pub async fn create_user(conn: &MySqlPool, argon2: &Argon2<'_>, new_user: NewUser) -> Result<User, ApiError> {
    let password_hash = User::create_password_hash(&new_user.password, argon2);

    let result_1 = sqlx::query!(
        "
        INSERT INTO users (username, email, password_hash, full_name, bio, bot_score)
        VALUES (?, ?, ?, ?, ?, ?)",
        &new_user.username,
        &new_user.email,
        password_hash,
        &new_user.full_name,
        &new_user.bio,
        &new_user.bot_score
    )
    .execute(conn)
    .await;

    let latest_user_id = match result_1 {
        Ok(query_result) => query_result.last_insert_id(),
        Err(e) => return Err(ApiError::CannotCreateObject(e.to_string()))
    };

    let result_2 = sqlx::query_as!(User,
        r#"
    SELECT * FROM users WHERE id = ?;
        "#,
        latest_user_id
    ) 
    .fetch_one(conn)
    .await;

    match result_2 {
        Ok(user) => Ok(user),
        Err(err) => Err(ApiError::CannotCreateObject("Could not find recently created object: ".to_string() + &err.to_string()))
    }
}

pub async fn verify_auth_details(conn: &MySqlPool, argon2: &Argon2<'_>, username: String, password: String) -> Result<String, ApiError> {
    let result = sqlx::query_as!(User,
        r#"
        SELECT * FROM users where username = ?;
        "#,
        username
    ).fetch_one(conn).await;

    // Create user login logic
    let user= match result {
        Ok(user) => user,
        Err(_) => return Err(ApiError::VerificationFailed("Username not found".into()))
    };

    if user.verify_password(&password, argon2) {
        Ok("Authorized".into())
    } else {
        Err(ApiError::VerificationFailed("Password was wrong".into()))
    }
}

pub async fn retrieve_user(conn: &MySqlPool, user_id: u64) -> Result<User, ApiError> {

    let result = sqlx::query_as!(User,
        r#"
    SELECT * FROM users WHERE id = ?;
        "#,
        user_id
    )
    .fetch_one(conn).await;

    match result {
        Ok(user) => return Ok(user),
        Err(e) => return Err(ApiError::CannotCreateObject(e.to_string()))
    }
}