use actix_web::HttpResponse;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct Response<T: Serialize> {
    pub status: String,
    pub message: T,
}

#[derive(Deserialize, Serialize)]
pub enum ApiError {
    ServerError,
    CannotCreateObject(String),
    ObjectNotFound,
    VerificationFailed(String)
}


impl<T> Response<T>
where T: Serialize
{
    pub fn create_post_response(data: Result<T, ApiError>) -> HttpResponse {
        match data {
            Ok(user) => {
                HttpResponse::Created().json(Response {
                    status: "success".into(),
                    message: user
                })
            },
            Err(err) => Self::create_error_response(err)
        }
    }

    pub fn create_get_response(data: Result<T, ApiError>) -> HttpResponse {
        match data {
            Ok(a) => HttpResponse::Ok().json(Response {
                status: "success".into(),
                message: a,
            }), 
            Err(err) => Self::create_error_response(err)
        }
    }

    pub fn create_error_response(err: ApiError) -> HttpResponse {
        match err {
            ApiError::ServerError => HttpResponse::InternalServerError().json(Response{
                status: "failed".into(),
                message: "Internal Server Error"
            }),
            ApiError::CannotCreateObject(message) => HttpResponse::BadRequest().json(Response {
                status: "failed".into(),
                message
            }),
            ApiError::ObjectNotFound => HttpResponse::NotFound().json(Response {
                status: "failed".into(),
                message: "Resource not found"
            }),
            ApiError::VerificationFailed(message) => HttpResponse::Unauthorized().json(Response {
                status: "failed".into(),
                message: message
            })
        }
    }
}