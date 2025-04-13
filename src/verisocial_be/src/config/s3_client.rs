use aws_config::Region;
use aws_sdk_s3::{Client, Config};
use log::error;

pub async fn create_spaces_client(endpoint: String, region: String) -> Client {
    let shared_config = aws_config::from_env()
        .region(Region::new(region))
        .load()
        .await;

    let credentials_provider = match shared_config.credentials_provider() {
        Some(provider) => provider,
        None => {
            error!("Failed to get credentials provider from AWS config.");
            std::process::exit(1);
        }
    };

    let config = Config::builder()
        .endpoint_url(endpoint)
        .credentials_provider(credentials_provider)
        .build();

    Client::from_conf(config)
}