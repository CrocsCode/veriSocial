import boto3
from app.config import settings

session = boto3.Session(
    aws_access_key_id=settings.aws_access_key_id,
    aws_secret_access_key=settings.aws_secret_access_key,
)

s3 = session.client(
    's3',
    region_name=settings.aws_region,
    endpoint_url=f'https://{settings.bucket_name}.lon1.digitaloceanspaces.com',
)


# session = boto3.Session()
# s3 = session.client(
#     "s3",
#     region_name=AWS_REGION,
#     endpoint_url=endpoint_url,
#     aws_access_key_id=AWS_ACCESS_KEY,
#     aws_secret_access_key=AWS_SECRET_KEY,
# )
