use config::Config;
use std::{collections::HashMap, env};
use lazy_static::lazy_static;

lazy_static!{
    pub static ref SECRET: String = set_secret();
    pub static ref AI_IMAGE_URL: String = set_ai_checker();
    pub static ref MAX_FILE_SIZE: u64 = set_max_file_size();
}

pub fn init_config() -> HashMap<String, String> {
    // Dotenv
    dotenvy::dotenv().ok();
    
    let config_file = Config::builder()
        .add_source(config::Environment::with_prefix("APP"))
        .build()
        .unwrap();

    config_file.try_deserialize::<HashMap<String, String>>().unwrap()
}

fn set_secret() -> String {
    dotenvy::dotenv().ok();
    env::var("AUTH_SECRET").unwrap()
}

fn set_ai_checker() -> String {
    dotenvy::dotenv().ok();
    env::var("AI_IMAGE_CHECKER_URL").unwrap()
}

fn set_max_file_size() -> u64 {
    dotenvy::dotenv().ok();
    env::var("MAX_FILE_SIZE")
        .unwrap()
        .parse::<u64>()
        .expect("Can't parse the file size")
}