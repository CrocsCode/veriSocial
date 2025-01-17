use actix_web::{HttpServer, App, web};
use actix_web::middleware::Logger;
use env_logger::Env;
use sqlx::migrate::Migrator;
use sqlx::mysql::MySqlPoolOptions;
use log::{info, error};

mod services;
mod models;
mod config;

static MIGRATOR: Migrator = sqlx::migrate!("./db/migrations");

/// Main Function for server
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialise Configuration
    config::config::init_config();

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

    let app_data = models::models::AppState {
        conn_pool: pool
    };

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(app_data.clone()))
            .service(services::users::retrieve_user)
            .wrap(Logger::default())
    })
    .bind((app_url, 8080))?
    .run()
    .await
}