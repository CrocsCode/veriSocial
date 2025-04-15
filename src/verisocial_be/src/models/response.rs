use actix_web::HttpResponse;
use std::fmt;
use serde::{Deserialize, Serialize};


#[derive(Deserialize, Debug)]
pub struct ImageResponse {
    pub _post_id: usize,
    pub _class_type: String,
    pub _score: f64
}

#[derive(Deserialize, Serialize)]
pub struct Response<T: Serialize> {
    pub status: String,
    pub message: T,
}

#[derive(Deserialize, Serialize)]
pub enum ApiError {
    ServerError(String),
    CannotCreateObject(String),
    ObjectNotFound(String),
    UpdateError(String),
    DeleteError(String),
    AuthError(String),
    CannotUpload(String)
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
            ApiError::ServerError(description) => HttpResponse::InternalServerError().json(Response{
                status: "failed".into(),
                message: "Internal Server Error: ".to_owned() + &description.to_owned() 
            }),
            ApiError::CannotCreateObject(description) => HttpResponse::BadRequest().json(Response {
                status: "failed".into(),
                message: description
            }),
            ApiError::ObjectNotFound(description) => HttpResponse::NotFound().json(Response {
                status: "failed".into(),
                message: description
            }),
            ApiError::UpdateError(description) => HttpResponse::BadRequest().json(Response {
                status: "failed".into(),
                message: description
            }),
            ApiError::DeleteError(description) => HttpResponse::BadRequest().json(Response {
                status: "failed".into(),
                message: description
            }),
            ApiError::AuthError(description) => HttpResponse::BadRequest().json(Response {
                status: "failed".into(),
                message: description
            }),
            ApiError::CannotUpload(description) => HttpResponse::BadRequest().json(Response {
                status: "failed".into(),
                message: description
            })
        }
    }
}

impl fmt::Display for ApiError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ApiError::ServerError(msg) => write!(f, "Server error: {}", msg),
            ApiError::CannotCreateObject(msg) => write!(f, "Cannot create object: {}", msg),
            ApiError::ObjectNotFound(msg) => write!(f, "Object not found: {}", msg),
            ApiError::UpdateError(msg) => write!(f, "Update error: {}", msg),
            ApiError::DeleteError(msg) => write!(f, "Delete error: {}", msg),
            ApiError::AuthError(msg) => write!(f, "Authentication error: {}", msg),
            ApiError::CannotUpload(msg) => write!(f, "Cannot upload: {}", msg),
        }
    }
}