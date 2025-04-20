import os
from fastapi import FastAPI, HTTPException
import boto3
from botocore.exceptions import ClientError
from pydantic import BaseModel
from PIL import Image
from io import BytesIO
from transformers import pipeline

# Simple body
class RequestBody(BaseModel):
    post_id: int
    image_url: str

class ResponseBody(BaseModel):
    post_id: int
    class_type: str
    score: float

# AI initialization
# Downloads model everytime again (not that good for now)
classifier = pipeline("image-classification", model="NYUAD-ComNets/AI-generated_images_detector", device="cpu")

# S3 Client Initalization
SPACE_NAME = "fyp-jajo-verisocial-image-storage" # Won't change in our project
IMAGE_PREFIX = os.getenv("BUCKET_NAME")
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION")
endpoint_url= f'https://fyp-jajo-verisocial-image-storage.lon1.digitaloceanspaces.com'

session = boto3.Session()
s3 = session.client(
    "s3",
    region_name=AWS_REGION,
    endpoint_url=endpoint_url,
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
)

# App initialization
app = FastAPI(title="AI Content Detector")

@app.post("/classify")
async def classify(body: RequestBody):
    image = get_image(body.image_url)

    if image is None:
        raise HTTPException(status_code=500)

    # Write the AI classification function
    pred = classifier(image)

    #Create Response
    class_type = pred[0]["label"]
    score = pred[0]["score"]

    response = ResponseBody(post_id=body.post_id, class_type=class_type, score=score)

    return response

def get_image(image_url: str):
    try:
        key = image_url.split("/")[-1]

        resp = s3.get_object(
            Bucket=IMAGE_PREFIX,
            Key=key
        )
        
        data = resp["Body"].read()
        img = Image.open(BytesIO(data))
        return img
    except ClientError as e:
        print(f"Error fetching image: {image_url}\nError: {e}")
        return None