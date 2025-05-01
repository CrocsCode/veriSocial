use actix_web::{middleware::from_fn, web};

use super::handlers;
use crate::routes::middleware::auth_middleware::auth_middleware;

pub fn post_config(config: &mut web::ServiceConfig){
    config
        .service(
            web::scope("/posts")
            .wrap(from_fn(auth_middleware))
            .service(handlers::posts::timeline)
            .service(handlers::posts::like_post)
            .service(handlers::posts::get_comments)
            .service(handlers::posts::post_comment)
            .service(handlers::posts::create_new_post)
            .service(handlers::posts::retrieve_individual_post)
            .service(handlers::posts::retrieve_posts)
        );
}

pub fn game_config(config: &mut web::ServiceConfig){
    config
        .service(
            web::scope("/game")
            .wrap(from_fn(auth_middleware))
            .service(handlers::posts::add_game_event)
            .service(handlers::posts::list_game_events_for_user)
            .service(handlers::posts::game_pop_up)
            .service(handlers::posts::get_leaderboard)
        );
}

pub fn admin_config(config: &mut web::ServiceConfig){
    config
        .service(
            web::scope("/admin")
            .wrap(from_fn(auth_middleware))
            .service(handlers::posts::report_post)
            .service(handlers::posts::get_all_reports)
        );
}