use config::Config;
use std::{collections::HashMap, env};
use lazy_static::lazy_static;

lazy_static!{
    pub static ref SECRET: String = set_secret();
    pub static ref AI_IMAGE_URL: String = set_ai_checker();
}

pub fn init_config() -> HashMap<String, String> {
    // Dotenv
    dotenvy::dotenv().ok().unwrap(); 
    
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