use actix_web::{middleware::from_fn, web};

use super::handlers;
use crate::routes::middleware::auth_middleware::auth_middleware;

pub fn config(config: &mut web::ServiceConfig){
    config
        .service(
            web::scope("/home")
            .wrap(from_fn(auth_middleware))
            .service(handlers::users::retrieve_list_of_users)
            .service(handlers::users::retrieve_user)
            .service(handlers::users::user_follow)
            .service(handlers::users::user_unfollow)
        );
}