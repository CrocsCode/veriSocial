use actix_web::{get, HttpResponse, Responder};

use crate::models::response::Response;


#[get("/iamteapot")]
pub async fn teapot() -> impl Responder {
    HttpResponse::Ok().json(Response {
        status: "success".into(),
        message: "Stand proud for you are a teapot too."
    })
}