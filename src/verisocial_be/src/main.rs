use actix_cors::Cors;
use actix_web::http::header;
use actix_web::{HttpServer, App, web};
use actix_web::middleware::Logger;
use argon2::Argon2;
use reqwest::Client as Req_client;
use env_logger::Env;
use routes::{auth_config, post_config, user_config};
use sqlx::migrate::Migrator;
use sqlx::mysql::MySqlPoolOptions;
use log::{info, error};

use crate::config::settings;

mod services;
mod models;
mod routes;
mod config;

static MIGRATOR: Migrator = sqlx::migrate!("../db/migrations");


/// Main Function for server
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Logger
    env_logger::init_from_env(Env::default().default_filter_or("info"));

    // Initialise Configuration
    let database_url = (*settings::APP_DATABASE_URL).clone();
    let app_url = (*settings::APP_URL).clone();
    let _ = (*settings::SECRET).clone(); // Ensure this value is initialized
    let _ = (*settings::MAX_FILE_SIZE).clone();
    let ai_image_url = (*settings::AI_IMAGE_URL).clone();
    let aws_region = (*settings::AWS_REGION).clone();
    let aws_endpoint = (*settings::AWS_ENDPOINT).clone();
    let aws_secret = (*settings::AWS_SECRET_ACCESS_KEY).clone();
    let aws_key_id = (*settings::AWS_ACCESS_KEY_ID).clone();
    let bucket_name = (*settings::BUCKET_NAME).clone();


    info!("DATABASE_URL: {}", database_url);
    info!("APP_URL: {}", app_url);

    // Init database connection
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

    // Init Bucket Connection
    let s3_client = config::s3_client::create_spaces_client(aws_key_id, aws_secret,aws_endpoint,  aws_region).await;
    info!("Successfully started S3 client!");
    
    // Init Client
    let client =  Req_client::new();
    info!("Successfully started Reqwest client!");

    let app_data = models::app_config::AppConfig {
        pass_hashing: Argon2::default(), // Password Hashing
        pool,
        _client : client,
        _ai_image_url: ai_image_url,
        s3_client,
        bucket_name
    };

    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .wrap(
                Cors::default()
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