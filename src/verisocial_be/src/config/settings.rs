use std::env;
use log::error;
use lazy_static::lazy_static;

lazy_static!{
    pub static ref SECRET: String = set_secret();
    pub static ref AI_IMAGE_URL: String = set_ai_checker();
    pub static ref MAX_FILE_SIZE: u64 = set_max_file_size();
    pub static ref APP_DATABASE_URL: String = set_database_url();
    pub static ref APP_URL: String = set_server_ip();
    pub static ref AWS_ENDPOINT: String = set_aws_endpoint();
    pub static ref AWS_REGION: String = set_aws_region();
    pub static ref AWS_ACCESS_KEY_ID: String = set_aws_access_key();
    pub static ref AWS_SECRET_ACCESS_KEY: String = set_aws_secret();
}

fn set_secret() -> String {
    dotenvy::dotenv().ok();
    match std::env::var("AUTH_SECRET") {
        Ok(s) => s,
        Err(_) => {
            error!("Expected AUTH_SECRET to be set");
            std::process::exit(1)
        }
    }
}

fn set_ai_checker() -> String {
    dotenvy::dotenv().ok();
    match std::env::var("AI_IMAGE_CHECKER_URL") {
        Ok(s) => s,
        Err(_) => {
            error!("Expected AI_IMAGE_CHECKER_URL to be set");
            std::process::exit(1)
        }
    }
}

fn set_max_file_size() -> u64 {
    dotenvy::dotenv().ok();
    env::var("MAX_FILE_SIZE")
        .unwrap()
        .parse::<u64>()
        .expect("Can't parse the file size")
}

fn set_database_url() -> String {
    dotenvy::dotenv().ok();
    match std::env::var("APP_DATABASE_URL") {
        Ok(s) => s,
        Err(_) => {
            error!("Expected APP_DATABASE_URL to be set");
            std::process::exit(1)
        }
    }
}

fn set_server_ip() -> String {
    dotenvy::dotenv().ok();
    match std::env::var("APP_URL") {
        Ok(s) => s,
        Err(_) => {
            error!("Expected APP_URL to be set");
            std::process::exit(1)
        }
    }
}

fn set_aws_endpoint() -> String {
    dotenvy::dotenv().ok();
    match std::env::var("AWS_ENDPOINT") {
        Ok(s) => s,
        Err(_) =>  {
            error!("Expected AWS_ENDPOINT to be set");
            std::process::exit(1)
        }
    }
}

fn set_aws_region() -> String {
    dotenvy::dotenv().ok();
    match std::env::var("AWS_REGION") {
        Ok(s) => s,
        Err(_) =>  {
            error!("Expected AWS_REGION to be set");
            std::process::exit(1)
        }
    }
}

fn set_aws_access_key() -> String {
    dotenvy::dotenv().ok();
    match std::env::var("AWS_ACCESS_KEY_ID") {
        Ok(s) => s,
        Err(_) =>  {
            error!("Expected AWS_ACCESS_KEY_ID to be set");
            std::process::exit(1)
        }
    }
}

fn set_aws_secret() -> String {
    dotenvy::dotenv().ok();
    match std::env::var("AWS_SECRET_ACCESS_KEY") {
        Ok(s) => s,
        Err(_) =>  {
            error!("Expected AWS_SECRET_ACCESS_KEY to be set");
            std::process::exit(1)
        }
    }
}