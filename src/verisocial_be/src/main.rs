use actix_cors::Cors;
use actix_web::http::header;
use actix_web::{HttpServer, App, web};
use actix_web::middleware::Logger;
use argon2::Argon2;
use reqwest::Client;
use env_logger::Env;
use routes::{auth_config, post_config, user_config};
use sqlx::migrate::Migrator;
use sqlx::mysql::MySqlPoolOptions;
use log::{info, error};

mod services;
mod models;
mod routes;
mod config;

static MIGRATOR: Migrator = sqlx::migrate!("./db/migrations");


/// Main Function for server
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialise Configuration
    config::settings::init_config();

    // Logger
    env_logger::init_from_env(Env::default().default_filter_or("info"));

    let database_url = std::env::var("APP_DATABASE_URL").unwrap();
    let app_url = std::env::var("APP_URL").unwrap();

    let pool = match MySqlPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
    {
        Ok(pool) => {
            info!("Connection to database successfull!");
            pool
        }
        Err(err) => {
            error!("Failed to connect to database: {:?}", err);
            std::process::exit(1)
        }
    };
    
    // Migrate schema
    MIGRATOR.run(&pool).await.expect("Failed to run migrations");
    info!("Migrations have been applied");

    let client =  Client::new();
    let app_data = models::app_state::AppState {
        pass_hashing: Argon2::default(), // Password Hashing
        pool,
        client
    };

    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .wrap(
                Cors::default()
                // .allowed_origin(origin) When frontend is defined, this wll be here.
                    //.allowed_origin("http://localhost:5173") // For testing purposes only (temporary)
                    .allow_any_origin()  // Deployment inside docker compose
                    .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
                    .allowed_headers(vec![header::AUTHORIZATION, header::CONTENT_TYPE])
                    .supports_credentials()
                    .max_age(3600)
            )
            .app_data(actix_web::web::PayloadConfig::new(usize::MAX))
            .app_data(web::Data::new(app_data.clone()))
            .service(routes::teapot::teapot)
            .configure(auth_config::config)
            .configure(user_config::config)
            .configure(post_config::config)
    })
    .bind((app_url, 8080))?
    .run()
    .await
}