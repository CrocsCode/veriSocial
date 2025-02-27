use actix_web::{get, post, web, Responder};
use crate::models::{
    app_state::AppState, response::Response, posts::NewPost
};
use crate::services::posts;


#[get("/{user_id}")]
pub async fn retrieve_posts(user_id: web::Path<u64>, app_data: web::Data<AppState<'_>>) -> impl Responder {
    let id = user_id.into_inner();
    let conn = &app_data.into_inner().pool;

    // find user
    let posts = posts::user_posts(conn, id).await;
    Response::create_get_response(posts)
}

#[get("/{user_id}/{post_id}")]
pub async fn retrieve_individual_post(id: web::Path<(u64, u64)>, app_data: web::Data<AppState<'_>>) -> impl Responder {
    let post_id = id.1;
    let post = posts::individual_user_post(&app_data.pool, post_id).await;
    Response::create_get_response(post)
}

#[post("/{user_id}")]
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

#[get("/fyp/{user_id}")]
pub async fn for_you_page(user_id: web::Path<u64>,app_data: web::Data<AppState<'_>>) -> impl Responder {
    let posts = posts::user_following_timeline(&app_data.pool, *user_id).await;
    Response::create_get_response(posts)
}

// Tests for creating post
// '{
//     user_id: 1,
//     content: "I am the best around!"
// }'