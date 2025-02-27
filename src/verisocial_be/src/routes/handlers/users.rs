use actix_web::{get, post, web, Responder};
use crate::models::user::FollowRequest;
use crate::models::{
    app_state::AppState, response::Response, user::NewUser, user::AuthDetails
};
use crate::services::users;

/// TODO:
/// Retrieve user
/// Retrieve multiple
/// Register
/// Delete
/// Follow
/// Unfollow


#[get("/user/{user_id}")]
pub async fn retrieve_user(user_id: web::Path<u64>, app_data: web::Data<AppState<'_>>) -> impl Responder {
    let id = user_id.into_inner();
    let conn = &app_data.into_inner().pool;

    // find user
    let user = users::retrieve_user(conn, id).await;
    Response::create_get_response(user)
}

#[get("/users")]
pub async fn retrieve_list_of_users(app_data: web::Data<AppState<'_>>) -> impl Responder {
    let resp = users::retrieve_user_list(&app_data.into_inner().pool).await;
    Response::create_get_response(resp)
}

#[post("/user/follow")]
pub async fn user_follow(json: web::Json<FollowRequest>, app_data: web::Data<AppState<'_>>) -> impl Responder {
    let follow_request = json.into_inner();
    let conn = &app_data.into_inner().pool;

    let result = users::add_follow(follow_request, conn).await;
    Response::create_post_response(result)
}

#[post("/user/unfollow")]
pub async fn user_unfollow(json: web::Json<FollowRequest>, app_data: web::Data<AppState<'_>>) -> impl Responder {
    let follow_request = json.into_inner();
    let conn = &app_data.into_inner().pool;

    let result = users::remove_follow(follow_request, conn).await;
    Response::create_post_response(result)
}

#[post("/login")]
pub async fn login_user(json: web::Json<AuthDetails>,data: web::Data<AppState<'_>>) -> impl Responder {
    let auth = json.into_inner();
    let app_state = &data.into_inner();

    // Verify login
    let login = users::verify_auth_details(&app_state.pool, &app_state.pass_hashing, auth.username, auth.password).await;
    println!("Success");
    Response::create_get_response(login)
}

#[post("/register")]
pub async fn create_user(json: web::Json<NewUser>, data: web::Data<AppState<'_>>) -> impl Responder {
    let new_user = json.into_inner(); // Destructure json into user.
    let app_state = &data.into_inner();
    
    // Create user
    let user = users::create_user(&app_state.pool, &app_state.pass_hashing, new_user).await;
    Response::create_post_response(user)
}
