use sqlx::MySqlPool;
use argon2::Argon2;
use crate::services::auth;
use crate::models::{
    response::ApiError,
    user::{FollowRequest, NewUser, User},
};

pub async fn create_user(conn: &MySqlPool, argon2: &Argon2<'_>, new_user: NewUser) -> Result<User, ApiError> {
    let password_hash = User::create_password_hash(&new_user.password, argon2);

    let result_1 = sqlx::query!(
        r#"
        INSERT INTO users (username, email, password_hash, full_name, bio, bot_score)
        VALUES (?, ?, ?, ?, ?, ?)
        "#,
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
        SELECT * FROM users WHERE user_id = ?;
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

pub async fn retrieve_user_list(conn: &MySqlPool) -> Result<Vec<User>, ApiError> {
    let query = sqlx::query_as!(User,
    r#"
    SELECT * FROM users
    "#
    ).fetch_all(conn).await;

    match query {
        Ok(resp) => Ok(resp),
        Err(err) => Err(ApiError::ObjectNotFound("Can't retrieve list of users at this time:\n ".to_string() + &err.to_string()))
    }
}

pub async fn verify_auth_details(conn: &MySqlPool, argon2: &Argon2<'_>, email: String, password: String) -> Result<String, ApiError> {
    let result = sqlx::query_as!(User,
        r#"
        SELECT * FROM users where email = ?;
        "#,
        email
    ).fetch_one(conn).await;

    // Create user login logic
    let user= match result {
        Ok(user) => user,
        Err(_) => return Err(ApiError::AuthError("Username not found".into()))
    };

    if user.verify_password(&password, argon2) {
        let jwt = auth::generate_jwt(&user.user_id.to_string());
        Ok(jwt)
    } else {
        Err(ApiError::AuthError("Passwords don't match".into()))
    }
}

pub async fn retrieve_user(conn: &MySqlPool, user_id: u64) -> Result<User, ApiError> {
    let result = sqlx::query_as!(User,
        r#"
        SELECT * FROM users WHERE user_id = ?;
        "#,
        user_id
    )
    .fetch_one(conn).await;

    match result {
        Ok(user) => return Ok(user),
        Err(e) => return Err(ApiError::CannotCreateObject(e.to_string()))
    }
}

pub async fn add_follow(follow_request: FollowRequest, conn: &MySqlPool) -> Result<String, ApiError> {
    let query = sqlx::query!(
        r#"
        INSERT INTO follow (followee_id, follower_id) VALUES (?, ?)
        "#,
        follow_request.followee_id,
        follow_request.follower_id
    )
    .execute(conn)
    .await;

    match query {
        Ok(_) => Ok("Success".to_string()),
        Err(err) => Err(ApiError::CannotCreateObject("Users with specified IDs can't be found:\n".to_string() + &err.to_string()))
    }
}

pub async fn remove_follow(follow_request: FollowRequest, conn: &MySqlPool) -> Result<String, ApiError> {
    let query = sqlx::query!(
        r#"
        DELETE FROM
            follow
        WHERE
            follower_id = ? OR followee_id = ?
        "#,
        follow_request.follower_id,
        follow_request.followee_id
    )
    .execute(conn)
    .await;

    match query {
        Ok(_) => Ok("Unfollow operation success!".to_string()),
        Err(_) => Err(ApiError::DeleteError("Could not unfollow.".to_string()))
    }
}