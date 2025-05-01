use serde::Deserialize;
use std::{fs::File, io::Read, path::Path};
use log::error;
use lazy_static::lazy_static;

// Expose a global CONFIG via `lazy_static!`
lazy_static! {
    pub static ref CONFIG: Config = load_config();
}

lazy_static! {
    pub static ref SECRET: String = CONFIG.auth_secret.clone();
    pub static ref AI_IMAGE_URL: String = CONFIG.ai_image_checker_url.clone();
    pub static ref MAX_FILE_SIZE: u64 = CONFIG.max_file_size;
    pub static ref APP_DATABASE_URL: String = CONFIG.app_database_url.clone();
    pub static ref APP_URL: String = CONFIG.app_url.clone();
    pub static ref AWS_ENDPOINT: String = CONFIG.aws_endpoint.clone();
    pub static ref AWS_REGION: String = CONFIG.aws_region.clone();
    pub static ref AWS_ACCESS_KEY_ID: String = CONFIG.aws_access_key_id.clone();
    pub static ref AWS_SECRET_ACCESS_KEY: String = CONFIG.aws_secret_access_key.clone();
    pub static ref BUCKET_NAME: String = CONFIG.bucket_name.clone();
}

// Usage e
// Define a single Config struct matching all fields from the YAML
#[derive(Debug, Deserialize)]
pub struct Config {
    auth_secret: String,
    ai_image_checker_url: String,
    max_file_size: u64,
    app_database_url: String,
    app_url: String,
    aws_endpoint: String,
    aws_region: String,
    aws_access_key_id: String,
    aws_secret_access_key: String,
    bucket_name: String,
}

// Load and parse the YAML into the `Config` struct
fn load_config() -> Config {
    let path = Path::new("./config.yml");
    let mut file = File::open(path).unwrap_or_else(|e| {
        error!("Failed to open config file {}: {}", path.display(), e);
        std::process::exit(1);
    });
    let mut contents = String::new();
    file.read_to_string(&mut contents).unwrap_or_else(|e| {
        error!("Failed to read config file {}: {}", path.display(), e);
        std::process::exit(1);
    });

    serde_yaml::from_str(&contents).unwrap_or_else(|e| {
        error!("Failed to parse YAML config: {}", e);
        std::process::exit(1);
    })
}
