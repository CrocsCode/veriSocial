use actix_web::web;
use super::handlers;

pub fn config(config: &mut web::ServiceConfig){
    config
        .service(
            web::scope("/auth")
            .service(handlers::users::login_user)
            .service(handlers::users::create_user)
        );
}