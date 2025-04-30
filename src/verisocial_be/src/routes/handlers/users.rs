use actix_web::{get, post, web, Responder};
use crate::models::{
    app_config::AppConfig, response::Response, user::NewUser, user::AuthDetails
};
use crate::repositories::user_repo::UserRepo;
use crate::services::users;


#[get("/user/{user_id}")]
pub async fn retrieve_user(user_id: web::Path<u64>, app_data: web::Data<AppConfig<'_>>, repo: web::Data<UserRepo>) -> impl Responder {
    let id = user_id.into_inner();
    let conn = &app_data.into_inner().pool;
    let user_repo = repo.into_inner();

    // find user
    let user = users::retrieve_user(conn, id, &user_repo).await;
    Response::create_get_response(user)
}

#[get("/users")]
pub async fn retrieve_list_of_users(app_data: web::Data<AppConfig<'_>>, user_repo: web::Data<UserRepo>) -> impl Responder {
    let resp = users::retrieve_user_list(&app_data.into_inner().pool, &user_repo).await;
    Response::create_get_response(resp)
}

#[post("/login")]
pub async fn login_user(json: web::Json<AuthDetails>,data: web::Data<AppConfig<'_>>, user_repo: web::Data<UserRepo>) -> impl Responder {
    let auth = json.into_inner();
    let app_state = &data.into_inner();

    // Verify login
    let login = users::verify_auth_details(&app_state.pool, &app_state.pass_hashing, auth.email, auth.password, &user_repo).await;
    Response::create_get_response(login)
}

#[post("/register")]
pub async fn create_user(json: web::Json<NewUser>, data: web::Data<AppConfig<'_>>, user_repo: web::Data<UserRepo>) -> impl Responder {
    let new_user = json.into_inner(); // Destructure json into user.
    let app_state = &data.into_inner();
    
    // Create user
    let user = users::create_user(&app_state.pool, &app_state.pass_hashing, new_user, &user_repo).await;
    Response::create_post_response(user)
}