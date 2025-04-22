use actix_web::{middleware::from_fn, web};

use super::handlers;
use crate::routes::middleware::auth_middleware::auth_middleware;

pub fn config(config: &mut web::ServiceConfig){
    config
        .service(
            web::scope("/posts")
            .wrap(from_fn(auth_middleware))
            .service(handlers::posts::timeline)
            .service(handlers::posts::like_post)
            .service(handlers::posts::get_comments)
            .service(handlers::posts::post_comment)
            .service(handlers::posts::create_new_post)
            .service(handlers::posts::game_pop_up)
            .service(handlers::posts::retrieve_individual_post)
            .service(handlers::posts::retrieve_posts)
        );
}