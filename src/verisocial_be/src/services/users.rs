use actix_web::{get, post, web, HttpResponse, Responder};
use crate::models::{
    models::User,
    response::Response
};

/// TODO:
/// Retrieve user
/// Retrieve multiple
/// Register
/// Delete
/// Follow
/// Unfollow


#[get("/")]
pub async fn retrieve_user() -> impl Responder {

    // let user = User {
    //     username: user_id.to_ascii_lowercase(),
    //     name: "Sean".into(),
    //     description: "Bot Slayer".into(),
    //     following: None,
    //     followers: None
    // };

    HttpResponse::Ok().json(Response {
        status: "success".into(),
        message: "user"
    })
}

#[post("/create-user")]
pub async fn create_user() -> impl Responder {
    //let new_user = payload.into_inner(); // Destructure json into user.

    

    HttpResponse::Ok().json(Response {
        status: "success".into(),
        message: "user"
    })
}

#[cfg(test)]
mod tests {
    use actix_web::{http::header::ContentType, test, App};
    use super::*;

    #[actix_web::test]
    async fn test_index_get() {
        let app = test::init_service(App::new().service(retrieve_user)).await;
        let req = test::TestRequest::default()
            .insert_header(ContentType::plaintext())
            .to_request();

        let resp = test::call_service(&app, req).await;
        println!("{:?}", resp.status());
        assert!(resp.status().is_success());
    }
}   