use serde_json::{json, Value};
use sqlx::MySqlPool;
use argon2::Argon2;
use crate::services::auth;
use crate::repositories::user_repo::{UserRepo, UserTrait};
use crate::models::{
    response::ApiError,
    user::{NewUser, User},
};

pub async fn create_user(conn: &MySqlPool, argon2: &Argon2<'_>, new_user: NewUser, user_repo: &UserRepo) -> Result<User, ApiError> {
    let password_hash = User::create_password_hash(&new_user.password, argon2);

    let latest_user_id = user_repo.create(conn, new_user, password_hash).await?;
    let created_user = user_repo.find_user_with_id(conn, latest_user_id).await?;

    Ok(created_user)
}

pub async fn retrieve_user_list(conn: &MySqlPool, user_repo: &UserRepo) -> Result<Vec<User>, ApiError> {
    let user_list = user_repo.find_all(conn).await?;

    Ok(user_list)
}

pub async fn verify_auth_details(conn: &MySqlPool, argon2: &Argon2<'_>, email: String, password: String, user_repo: &UserRepo)  -> Result<Value, ApiError> {

    let user = user_repo.find_user_with_email(conn, email).await?;

    if user.verify_password(&password, argon2) {
        let jwt = auth::generate_jwt(&user.user_id);
        let resp = json!({"token": jwt, "id": &user.user_id});
        Ok(resp)
    } else {
        Err(ApiError::AuthError("Passwords don't match".into()))
    }
}

pub async fn retrieve_user(conn: &MySqlPool, user_id: u64, user_repo: &UserRepo) -> Result<User, ApiError> {

    let user = user_repo.find_user_with_id(conn, user_id).await?;
    
    Ok(user)
}
