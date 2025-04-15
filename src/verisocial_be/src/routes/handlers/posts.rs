use actix_multipart::form::MultipartForm;
use actix_web::{get, post, web, Responder};
use crate::models::{
    app_config::{AppConfig, Pagination}, response::Response, posts::{NewPost, LikeEvent, NewComment}, auth::AuthUser
};
use crate::services::{comments, likes, posts};


#[get("/{user_id}")]
pub async fn retrieve_posts(user_id: web::Path<u64>, app_data: web::Data<AppConfig<'_>>, query: web::Query<Pagination>) -> impl Responder {
    let id = user_id.into_inner();
    let conn = &app_data.into_inner().pool;

    let page = query.page.unwrap_or(1);
    let size = query.size.unwrap_or(10);
    let page_offset = (page - 1) * size;

    let posts = posts::user_posts(conn, id, size, page_offset).await;
    Response::create_get_response(posts)
}

#[get("/{user_id}/{post_id}")]
pub async fn retrieve_individual_post(id: web::Path<(u64, u64)>, app_data: web::Data<AppConfig<'_>>, user: AuthUser) -> impl Responder {
    let post_id = id.1;
    let post = posts::individual_user_post(&app_data.pool, user.user_id, post_id).await;
    Response::create_get_response(post)
}

#[post("/{user_id}")]
pub async fn create_new_post(MultipartForm(form): MultipartForm<NewPost>, app_data: web::Data<AppConfig<'_>>, user: AuthUser) -> impl Responder {
    let result = posts::create_post(form, &app_data.into_inner(), user.user_id).await;
    Response::create_get_response(result)
}

#[get("/user")]
pub async fn timeline(app_data: web::Data<AppConfig<'_>>, query: web::Query<Pagination>, user: AuthUser) -> impl Responder {
    let conn = &app_data.into_inner().pool;

    let page = query.page.unwrap_or(1);
    let size = query.size.unwrap_or(10);
    let page_offset = (page - 1) * size;

    let result = posts::user_timeline(conn, user.user_id, size, page_offset).await;
    Response::create_get_response(result)
}

#[get("/fyp/{user_id}")]
pub async fn for_you_page(user_id: web::Path<u64>,app_data: web::Data<AppConfig<'_>>, query: web::Query<Pagination>) -> impl Responder {
    // Query
    let page = query.page.unwrap_or(1);
    let size = query.size.unwrap_or(10);
    let page_offset = (page - 1) * size;

    let posts = posts::user_following_timeline(&app_data.pool, *user_id, size, page_offset).await;
    Response::create_get_response(posts)
}

#[post("/like")]
pub async fn like_post(event: web::Json<LikeEvent>, user: AuthUser, app_data: web::Data<AppConfig<'_>>) -> impl Responder {
    let conn = &app_data.pool;
    
    let like = likes::toggle_like(conn, user.user_id, event.into_inner()).await;
    Response::create_post_response(like)
}

// GET and POST for comments
#[get("/comments/{post_id}")]
pub async fn get_comments(post_id: web::Path<u64>, user: AuthUser, app_data: web::Data<AppConfig<'_>>, query: web::Query<Pagination>) -> impl Responder {
    let conn = &app_data.pool;

    // Query
    let page = query.page.unwrap_or(1);
    let size = query.size.unwrap_or(10);
    let page_offset = (page - 1) * size;

    let comments = comments::retrieve_comments_for_post(conn, *post_id, user.user_id, size, page_offset).await;
    Response::create_get_response(comments)
}

#[post("/comments")]
pub async fn post_comment(new_comment: web::Json<NewComment>, user: AuthUser, app_data: web::Data<AppConfig<'_>>) -> impl Responder {

    let new_comment = comments::insert_comment(&app_data, user.user_id, new_comment.into_inner()).await;
    Response::create_post_response(new_comment)
}