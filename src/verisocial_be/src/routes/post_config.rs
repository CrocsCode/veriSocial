use actix_web::{middleware::from_fn, web};

use super::handlers;
use crate::routes::middleware::auth_middleware::auth_middleware;

pub fn config(config: &mut web::ServiceConfig){
    config
        .service(
            web::scope("/posts")
            .wrap(from_fn(auth_middleware))
            .service(handlers::posts::create_new_post)
            .service(handlers::posts::for_you_page)
            .service(handlers::posts::retrieve_individual_post)
            .service(handlers::posts::retrieve_posts)
            .service(handlers::posts::timeline)
        );
}