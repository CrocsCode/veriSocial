use actix_multipart::form::tempfile::TempFile;
use log::debug;
use reqwest::Client;
use serde_json::json;

use aws_sdk_s3::types::{CompletedMultipartUpload, CompletedPart};
use aws_sdk_s3::Client as S3Client;
use aws_sdk_s3::types::ObjectCannedAcl;
use aws_sdk_s3::primitives::{ByteStream, Length};

use crate::models::response::{ApiError, ImageResponse};
use crate::config::settings::AI_IMAGE_URL;


pub async fn post_check(image_name: String, post_id: u64, client: &Client) -> Result<(), ApiError> {
    // Build response
    let payload = json!({
        "post_id": post_id,
        "image_url": image_name
    });

    let resp = client.post(AI_IMAGE_URL.clone())
        .json(&payload)
        .send()
        .await;

    let succ_resp = match resp {
        Ok(json) => json.json::<ImageResponse>().await,
        Err(err) => return Err(ApiError::CannotUpload("Queuing image verification failed: ".to_string() + &err.to_string()))
    };

    match succ_resp {
        Ok(status) => {
            debug!("{}", status.status);
            Ok(())
        },
        Err(err) => Err(ApiError::ServerError(err.to_string()))
    }
}

pub async fn upload_image(filename: &str, image: TempFile, bucket_name: &str, s3_client: &S3Client) -> Result<(), ApiError> {
    const CHUNK_SIZE: u64 = 1024 * 1024 * 5; // Make configurable?

    let file_path = image.file.path();
    let file_size = image.size as u64; // Could throw an error.

    // Start multipart upload request for S3 bucket.
    let multipart_upload_res = match s3_client
        .create_multipart_upload()
        .bucket(bucket_name)
        .key(filename)
        .acl(ObjectCannedAcl::PublicRead)
        .send()
        .await {
            Ok(resp) => resp,
            Err(err) => return Err(ApiError::CannotUpload(err.to_string()))
        };

    let upload_id = multipart_upload_res.upload_id().ok_or(
        ApiError::ServerError("Could not upload to S3 Bucket".to_string())
    )?;

    // Prepare chunks for upload
    let mut chunk_count = (file_size / CHUNK_SIZE) + 1;
    let mut size_of_last_chunk = file_size % CHUNK_SIZE;
    if size_of_last_chunk == 0 {
        size_of_last_chunk = CHUNK_SIZE;
        chunk_count -= 1;
    }

    let mut upload_parts: Vec<CompletedPart> = Vec::new();

    for chunk_index in 0..chunk_count {
        // If a chunk is smaller than expected.
        let this_chunk = if chunk_count - 1 == chunk_index {
            size_of_last_chunk
        } else {
            CHUNK_SIZE
        };
        
        // Stream the next part of the file.
        let stream = match ByteStream::read_from()
            .path(file_path)
            .offset(chunk_index * CHUNK_SIZE)
            .length(Length::Exact(this_chunk))
            .build()
            .await {
                Ok(s) => s,
                Err(err) => return Err(ApiError::CannotUpload(err.to_string()))
            };

        // Chunk index starts from 0 but parts start from 1
        // Upload the next part of the file.
        let part_number = (chunk_index as i32) + 1;
        let upload_part_res = match s3_client
            .upload_part()
            .bucket(bucket_name)
            .key(filename)
            .upload_id(upload_id)
            .body(stream)
            .part_number(part_number)
            .send()
            .await {
                Ok(resp) => resp,
                Err(err) => return Err(ApiError::CannotUpload(err.to_string()))
            };

        upload_parts.push(
            CompletedPart::builder()
                .e_tag(upload_part_res.e_tag.unwrap_or_default())
                .part_number(part_number)
                .build(),
        );
    }

    let completed_multipart_upload: CompletedMultipartUpload = CompletedMultipartUpload::builder()
        .set_parts(Some(upload_parts))
        .build();


    let _complete_multipart_upload_res = match s3_client
        .complete_multipart_upload()
        .bucket(bucket_name)
        .key(filename)
        .multipart_upload(completed_multipart_upload)
        .upload_id(upload_id)
        .send()
        .await {
            Ok(resp) => resp,
            Err(err) => return Err(ApiError::CannotUpload(err.to_string()))
        };

    Ok(())
}

pub fn create_image_url(endpoint: &String, bucket_name: &String, filename: &String) -> String {
    let url = format!("{}/{}/{}", endpoint, bucket_name, filename);

    url
}