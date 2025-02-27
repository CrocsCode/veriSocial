use actix_web::{body::MessageBody, dev::{ServiceRequest, ServiceResponse}, Error, FromRequest, HttpMessage};
use actix_web::middleware::Next;
use actix_web_httpauth::extractors::bearer::BearerAuth;
use jsonwebtoken::{decode, Algorithm, DecodingKey, TokenData, Validation};

use crate::services::auth::Claims;
use crate::config::config::SECRET;


pub async fn auth_middleware(
    req: ServiceRequest,
    next: Next<impl MessageBody>
) -> Result<ServiceResponse<impl MessageBody>,Error> {
    dotenvy::dotenv().ok();

    let auth = BearerAuth::extract(&req.request()).await?;
    let token = auth.token();

    // Configure credentials
    let secret = SECRET.clone();

    // Set parameters for validation.
    let mut validation = Validation::new(Algorithm::HS256);
    validation.validate_exp = true;
    validation.set_issuer(&["http://verisocial-be.com"]);

    let token_data: TokenData<Claims> = decode(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &validation
    ).map_err(|err| actix_web::error::ErrorUnauthorized(err.to_string()))?;

    req.extensions_mut().insert(token_data.claims);

    next.call(req).await
}
