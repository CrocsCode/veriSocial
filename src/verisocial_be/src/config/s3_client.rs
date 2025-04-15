use aws_config::{Region, meta::region::RegionProviderChain};
use aws_config::from_env;
use aws_sdk_s3::config::{Credentials, SharedCredentialsProvider, Builder};
use aws_sdk_s3::Client;
use log::debug;

pub async fn create_spaces_client(access_key_id: String, secret_access_key: String, endpoint_url: &String, region: String) -> Client {
    let region_provider = RegionProviderChain::first_try(Region::new(region));

    let credentials_provider = SharedCredentialsProvider::new(
        Credentials::new(access_key_id, secret_access_key, None, None, "digitalOcean")
    );

    let shared_config = from_env()
        .region(region_provider)
        .credentials_provider(credentials_provider)
        .endpoint_url(endpoint_url)
        .load()
        .await;

    let s3_config = Builder::from(&shared_config)
        .force_path_style(true)
        .build();

    debug!("{:?}", s3_config);
    Client::from_conf(s3_config)
}