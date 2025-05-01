import os
import asyncio
import traceback
import boto3
from contextlib import contextmanager
from typing import Generator
from mysql.connector import pooling, Error
from mysql.connector.connection_cext import CMySQLConnection
from fastapi import FastAPI
from botocore.exceptions import ClientError
from pydantic import BaseModel
from PIL import Image
from io import BytesIO
from transformers import pipeline

# Simple body
class RequestBody(BaseModel):
    post_id: int
    text: str
    image_url: str | None

class ProcessedPost(BaseModel):
    post_id: int
    text_score: float
    image_score: float
    total_score: float

# Initialize in memory queue.
queue: asyncio.Queue[RequestBody] = asyncio.Queue()

# AI initialization
image_classifier = pipeline("image-classification", model="NYUAD-ComNets/AI-generated_images_detector", device="cpu")
text_classifier = pipeline("text-classification", model="fakespot-ai/roberta-base-ai-text-detection-v1", device="cpu")

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
    # Create a worker for classification
    asyncio.create_task(classifier_worker())

    # Create MySql pool
    app.state.mysql_pool = pooling.MySQLConnectionPool(
        pool_name="mypool",
        pool_size=3,
        pool_reset_session=True,
        host= os.getenv("DATABASE_HOST"),
        port= os.getenv("DATABASE_PORT"),
        user= os.getenv("DATABASE_USER"),
        password= os.getenv("DATABASE_SECRET"),
        database= os.getenv("DATABASE_NAME"),
    )
        
@app.post("/classify")
async def enqueue(body: RequestBody):
    await queue.put(body)
    return {"status":"accepted"}

# Classifying worker
async def classifier_worker():
    loop = asyncio.get_running_loop()

    while True:
        # Wait for a new job, but break cleanly on cancel
        try:
            req = await queue.get()
        except asyncio.CancelledError:
            print("Classifier worker cancelled; exiting.")
            break

        # Process it, catching only Exception 
        try:
            if image is None:
                image = await get_image(req.image_url)
                result = await loop.run_in_executor(None, classify, req, image)
                await update_post_score(result)
            else:
                result = await loop.run_in_executor(None, classify, req, image)
                await update_post_score(result)
        except Exception:
            print(f"Error processing post {req.post_id}")
            traceback.print_exc()
        finally:
            # Mark it done exactly once per successful queue.get()
            queue.task_done()

@contextmanager
def get_db_connection() -> Generator[CMySQLConnection, None, None]:
    try:
        conn = app.state.mysql_pool.get_connection()
        yield conn
    finally:
        conn.close()

def classify_text(body: RequestBody, image):
    # Write the AI classification function
    image_pred = image_classifier(image)
    text_pred = text_classifier(body.text)

    # Create Response
    text_class_type = text_pred[0]["label"]
    text_score = text_pred[0]["score"]

    #Create Response (needs to be changed to be custom, or maybe not?)
    image_class_type = image_pred[0]["label"]
    image_score = image_pred[0]["score"]

    weight =  0.5 # Should be customizable :)

    # Set a weghted average for total score
    if text_class_type == "Human" and image_class_type == "real":
        total_score = ((1 - image_score) * weight) + ((1 - text_score) * (1 - weight)) / 2

        response = ProcessedPost(post_id=body.post_id, text_score=1 - text_score, image_score=1 - image_score, total_score=total_score)
    elif text_class_type == "Human" and image_class_type != "real":
        total_score = (image_score * weight) + ((1 - text_score) * (1 - weight)) / 2

        response = ProcessedPost(post_id=body.post_id,  text_score=1 - text_score, image_score=image_score, total_score=total_score)
    elif text_class_type != "Human" and image_class_type == "real":
        total_score = ((1 - image_score) * weight) + (text_score * (1 - weight)) / 2

        response = ProcessedPost(post_id=body.post_id,  text_score=text_score, image_score=1 - image_score, total_score=total_score)
    else:
        total_score = (image_score * weight) + (text_score * (1 - weight)) / 2
        response = ProcessedPost(post_id=body.post_id, text_score=text_score, image_score=image_score, total_score=total_score)

    return response

def classify_text_and_image(body: RequestBody, image):
    # Write the AI classification function
    image_pred = image_classifier(image)
    text_pred = text_classifier(body.text)

    # Create Response
    text_class_type = text_pred[0]["label"]
    text_score = text_pred[0]["score"]

    #Create Response (needs to be changed to be custom, or maybe not?)
    image_class_type = image_pred[0]["label"]
    image_score = image_pred[0]["score"]

    weight =  0.5 # Should be customizable :)

    # Set a weghted average for total score
    if text_class_type == "Human" and image_class_type == "real":
        total_score = ((1 - image_score) * weight) + ((1 - text_score) * (1 - weight)) / 2

        response = ProcessedPost(post_id=body.post_id, text_score=1 - text_score, image_score=1 - image_score, total_score=total_score)
    elif text_class_type == "Human" and image_class_type != "real":
        total_score = (image_score * weight) + ((1 - text_score) * (1 - weight)) / 2

        response = ProcessedPost(post_id=body.post_id,  text_score=1 - text_score, image_score=image_score, total_score=total_score)
    elif text_class_type != "Human" and image_class_type == "real":
        total_score = ((1 - image_score) * weight) + (text_score * (1 - weight)) / 2

        response = ProcessedPost(post_id=body.post_id,  text_score=text_score, image_score=1 - image_score, total_score=total_score)
    else:
        total_score = (image_score * weight) + (text_score * (1 - weight)) / 2
        response = ProcessedPost(post_id=body.post_id, text_score=text_score, image_score=image_score, total_score=total_score)

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

async def update_post_score(post: ProcessedPost):
    try:
        # grab a fresh pooled connection
        with get_db_connection() as db:
            cursor = db.cursor()
            cursor.execute(
                "UPDATE posts " \
                "SET bot_score = %s, text_bot_score = %s, image_bot_score = %s" \
                "WHERE post_id = %s",
                (post.total_score, post.text_score, post.image_score, post.post_id),
            )
            db.commit()
            cursor.close()
    except Error as e:
        print("Transaction failed:", e)
        traceback.print_exc()