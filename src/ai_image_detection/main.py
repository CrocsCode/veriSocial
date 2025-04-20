import os
import asyncio
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

class ProcessedPost(BaseModel):
    post_id: int
    class_type: str
    score: float

# Initialize in memory queue.
queue: asyncio.Queue[RequestBody] = asyncio.Queue()

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

@app.on_event("startup")
async def startup():
    asyncio.create_task(classifier_worker())

@app.post("/classify")
async def enqueue(body: RequestBody):
    await queue.put(body)
    return {"status":"accepted"}

# Classifying worker
async def classifier_worker():
    loop = asyncio.get_running_loop()
    while True:
        try:
            req: RequestBody = await queue.get()
            image = await get_image(req.image_url)
            result: ProcessedPost = await loop.run_in_executor(
                None,
                classify,
                req,
                image
            )    
        except:
            raise
        finally:
            queue.task_done()

def classify(body: RequestBody, image):
    if image is None:
        print("Error")
        raise 

    # Write the AI classification function
    pred = classifier(image)

    #Create Response (needs to be changed to be custom)
    class_type = pred[0]["label"]
    score = pred[0]["score"]
    print(f"Image processed, score: {score}")

    response = ProcessedPost(post_id=body.post_id, class_type=class_type, score=score)

    return response

async def get_image(image_url: str):
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

