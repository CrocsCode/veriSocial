use config::Config;
use std::collections::HashMap;

pub fn init_config() -> HashMap<String, String> {
    // Dotenv
    dotenvy::dotenv().ok().unwrap(); 
    
    let config_file = Config::builder()
        .add_source(config::Environment::with_prefix("APP"))
        .build()
        .unwrap();

    config_file.try_deserialize::<HashMap<String, String>>().unwrap()
}