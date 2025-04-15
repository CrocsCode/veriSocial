use std::env;
use log::error;
use lazy_static::lazy_static;

lazy_static!{
    pub static ref SECRET: String = set_env_var("AUTH_SECRET");
    pub static ref AI_IMAGE_URL: String = set_env_var("AI_IMAGE_CHECKER_URL");
    pub static ref MAX_FILE_SIZE: u64 = set_max_file_size();
    pub static ref APP_DATABASE_URL: String = set_env_var("APP_DATABASE_URL");
    pub static ref APP_URL: String = set_env_var("APP_URL");
    pub static ref AWS_ENDPOINT: String = set_env_var("AWS_ENDPOINT");
    pub static ref AWS_REGION: String = set_env_var("AWS_REGION");
    pub static ref AWS_ACCESS_KEY_ID: String = set_env_var("AWS_ACCESS_KEY_ID");
    pub static ref AWS_SECRET_ACCESS_KEY: String = set_env_var("AWS_SECRET_ACCESS_KEY");
    pub static ref BUCKET_NAME: String = set_env_var("BUCKET_NAME");
}

fn set_max_file_size() -> u64 {
    dotenvy::dotenv().ok();
    env::var("MAX_FILE_SIZE")
        .unwrap()
        .parse::<u64>()
        .expect("Can't parse the file size")
}

fn set_env_var(var: &str) -> String {
    dotenvy::dotenv().ok();
    match std::env::var(&var) {
        Ok(s) => s,
        Err(_) =>  {
            error!("Expected {} to be set", var);
            std::process::exit(1)
        }
    }
}