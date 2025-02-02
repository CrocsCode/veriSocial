use actix_web::{get, post, web, Responder};
use crate::models::{
    app_state::AppState, response::Response, posts::NewPost
};
use crate::services::posts;

/// TODO:
/// Retrieve post [X]
/// Retrieve multiple posts []
/// Create post [X]
/// Retrieve timeline [X]

#[get("/user/{user_id}/posts")]
pub async fn retrieve_posts(user_id: web::Path<u64>, app_data: web::Data<AppState<'_>>) -> impl Responder {
    let id = user_id.into_inner();
    let conn = &app_data.into_inner().pool;

    // find user
    let posts = posts::user_posts(conn, id).await;
    Response::create_get_response(posts)
}


#[post("/user/{user_id}/posts")]
pub async fn create_new_post(json: web::Json<NewPost>, app_data: web::Data<AppState<'_>>) -> impl Responder {
    let post = json.into_inner();
    let conn = &app_data.into_inner().pool;

    let result = posts::create_post(conn, post).await;
    Response::create_get_response(result)
}

#[get("/user")]
pub async fn timeline(app_data: web::Data<AppState<'_>>) -> impl Responder {
    let conn = &app_data.into_inner().pool;

    let result = posts::user_timeline(conn).await;
    Response::create_get_response(result)
}

// Tests for creating post
// '{
//     user_id: 1,
//     content: "I am the best around!"
// }'