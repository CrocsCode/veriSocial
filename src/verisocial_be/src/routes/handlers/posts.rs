use actix_web::{get, post, web, Responder};
use crate::models::app_state::Pagination;
use crate::models::{
    app_state::AppState, response::Response, posts::{NewPost, LikePost}, auth::AuthUser
};
use crate::services::{posts, likes};


#[get("/{user_id}")]
pub async fn retrieve_posts(user_id: web::Path<u64>, app_data: web::Data<AppState<'_>>, query: web::Query<Pagination>) -> impl Responder {
    let id = user_id.into_inner();
    let conn = &app_data.into_inner().pool;

    let page = query.page.unwrap_or(1);
    let size = query.size.unwrap_or(10);
    let page_offset = (page - 1) * size;

    let posts = posts::user_posts(conn, id, size, page_offset).await;
    Response::create_get_response(posts)
}

#[get("/{user_id}/{post_id}")]
pub async fn retrieve_individual_post(id: web::Path<(u64, u64)>, app_data: web::Data<AppState<'_>>, user: AuthUser) -> impl Responder {
    let post_id = id.1;
    let post = posts::individual_user_post(&app_data.pool, post_id, user.user_id).await;
    Response::create_get_response(post)
}

#[post("/{user_id}")]
pub async fn create_new_post(json: web::Json<NewPost>, app_data: web::Data<AppState<'_>>) -> impl Responder {
    let post = json.into_inner();

    let result = posts::create_post(post, &app_data.into_inner()).await;
    Response::create_get_response(result)
}

#[get("/user")]
pub async fn timeline(app_data: web::Data<AppState<'_>>, query: web::Query<Pagination>, user: AuthUser) -> impl Responder {
    let conn = &app_data.into_inner().pool;

    let page = query.page.unwrap_or(1);
    let size = query.size.unwrap_or(10);
    let page_offset = (page - 1) * size;

    let result = posts::user_timeline(conn, user.user_id, size, page_offset).await;
    Response::create_get_response(result)
}

#[get("/fyp/{user_id}")]
pub async fn for_you_page(user_id: web::Path<u64>,app_data: web::Data<AppState<'_>>, query: web::Query<Pagination>) -> impl Responder {
    // Query
    let page = query.page.unwrap_or(1);
    let size = query.size.unwrap_or(10);
    let page_offset = (page - 1) * size;
    println!("fyp");
    let posts = posts::user_following_timeline(&app_data.pool, *user_id, size, page_offset).await;
    Response::create_get_response(posts)
}

#[post("/like")]
pub async fn like_post(post: web::Json<LikePost>, user: AuthUser, app_data: web::Data<AppState<'_>>) -> impl Responder {
    let conn = &app_data.pool;
    
    let like = likes::toggle_like(conn, user.user_id, post.into_inner().post_id).await;
    Response::create_post_response(like)
}

// Tests for creating post
// '{
//     user_id: 1,
//     content: "I am the best around!"
// }'