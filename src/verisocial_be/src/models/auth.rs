use actix_web::{dev::Payload, Error, FromRequest, HttpMessage, HttpRequest};
use std::future::{ready, Ready};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Claims {
    pub sub: u64,
    pub iss: String,
    pub exp: usize,
}

#[derive(Clone)]
pub struct AuthUser {
    pub user_id: u64
}


impl FromRequest for AuthUser {
    type Error = Error;
    type Future = Ready<Result<Self, Self::Error>>;

    fn from_request(req: &HttpRequest, _: &mut Payload) -> Self::Future {
        match req.extensions().get::<AuthUser>() {
            Some(user) => ready(Ok(user.clone())),
            None => ready(Err(actix_web::error::ErrorUnauthorized("User not authorized.")))
        }
    }
}