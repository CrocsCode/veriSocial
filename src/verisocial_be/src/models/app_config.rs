use argon2::Argon2;
use reqwest::Client as Req_client;
use sqlx::MySqlPool;
use serde::Deserialize;
use aws_sdk_s3::Client as S3_client;

#[derive(Clone)]
pub struct AppConfig<'a> {
    pub pass_hashing: Argon2<'a>,
    pub pool: MySqlPool,
    pub _client: Req_client,
    pub _ai_image_url: String,
    pub s3_client: S3_client,
    pub bucket_name: String
}

#[derive(Deserialize)]
pub struct Pagination {
    pub page: Option<u32>,
    pub size: Option<u32>
}