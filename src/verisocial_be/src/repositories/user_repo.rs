use mockall::automock;
use async_trait::async_trait;
use sqlx::MySqlPool;
use crate::models::{
    response::ApiError,
    user::User,
    user::NewUser
};


pub struct UserRepo {}
impl UserRepo {
    pub fn new() -> Self {
        Self {}
    }
}

#[automock]
#[async_trait]
pub trait UserTrait: Send + Sync {
    async fn create(&self, conn: &MySqlPool, new_user: NewUser, password: String) -> Result<u64, ApiError>;

    async fn find_all(&self, conn: &MySqlPool) -> Result<Vec<User>, ApiError>;

    async fn find_user_with_id(&self, conn: &MySqlPool, user_id: u64) -> Result<User, ApiError>;

    async fn find_user_with_email(&self, conn: &MySqlPool, email: String) -> Result<User, ApiError>;
}


#[async_trait]
impl UserTrait for UserRepo {
    // Returns ID for the created user
    async fn create(&self, conn: &MySqlPool, new_user: NewUser, password: String) -> Result<u64, ApiError> {
        let result = sqlx::query_as!(User,
            r#"
            INSERT INTO users (username, email, password_hash, full_name, bio, bot_score)
            VALUES (?, ?, ?, ?, ?, ?)
            "#,
            &new_user.username,
            &new_user.email,
            password,
            &new_user.full_name,
            &new_user.bio,
            &new_user.bot_score
        )
        .execute(conn)
        .await;

        match result {
            Ok(query) => Ok(query.last_insert_id()),
            Err(err) => Err(ApiError::CannotCreateObject(err.to_string()))
        }
    }

    // Returns all the users
    async fn find_all(&self, conn: &MySqlPool) -> Result<Vec<User>, ApiError> {
        let query = sqlx::query_as!(User,
            r#"
            SELECT * FROM users
            "#
        ).fetch_all(conn)
        .await;
        
        match query {
            Ok(resp) => Ok(resp),
            Err(err) => Err(ApiError::ObjectNotFound("Can't retrieve list of users at this time:\n ".to_string() + &err.to_string()))
        }
    }

    // Return a specific user of user_id
    async fn find_user_with_id(&self, conn: &MySqlPool, user_id: u64) -> Result<User, ApiError> {
        let result = sqlx::query_as!(User,
            r#"
            SELECT * FROM users WHERE user_id = ?;
            "#,
            user_id
        )
        .fetch_one(conn).await;
    
        match result {
            Ok(user) => Ok(user),
            Err(e) => Err(ApiError::ObjectNotFound(e.to_string()))
        }
    }

    async fn find_user_with_email(&self, conn: &MySqlPool, email: String) -> Result<User, ApiError> {
        let result = sqlx::query_as!(User,
            r#"
            SELECT * FROM users where email = ?;
            "#,
            email
        )
        .fetch_one(conn).await;

        match result {
            Ok(user) => Ok(user),
            Err(e) => Err(ApiError::ObjectNotFound(e.to_string()))
        }
    }
}