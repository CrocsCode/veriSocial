use actix_web::{HttpServer, App};

mod services;
mod models;

/// Main Function for server
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(services::users::hello)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}