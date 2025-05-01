import boto3
from app.config import settings

session = boto3.Session()
s3 = session.client(
    "s3",
    region_name=settings.aws_region,
    endpoint_url=settings.aws_endpoint,
    aws_access_key_id=settings.aws_access_key_id,
    aws_secret_access_key=settings.aws_secret_access_key,
)
