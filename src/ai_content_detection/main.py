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
    class_type: str
    score: float

# Initialize in memory queue.
queue: asyncio.Queue[RequestBody] = asyncio.Queue()

# AI initialization
# Downloads model everytime again (not that good for now)
image_classifier = pipeline("image-classification", model="NYUAD-ComNets/AI-generated_images_detector", device="cpu")
#text_classifier = pipeline()

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
            image = await get_image(req.image_url)
            if image is None:
                print(f"Could not fetch image for post {req.post_id}")
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

def classify(body: RequestBody, image):
    # Write the AI classification function
    pred = image_classifier(image)
    # text_score = text_classifier(text)

    #Create Response (needs to be changed to be custom)
    class_type = pred[0]["label"]
    score = pred[0]["score"]

    if class_type == "real":
        response = ProcessedPost(post_id=body.post_id, class_type=class_type, score=1 - score)
    else:
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

async def update_post_score(post: ProcessedPost):
    try:
        # grab a fresh pooled connection
        with get_db_connection() as db:
            cursor = db.cursor()
            cursor.execute(
                "UPDATE posts SET bot_score = %s WHERE post_id = %s",
                (post.score, post.post_id),
            )
            db.commit()
            cursor.close()
    except Error as e:
        print("Transaction failed:", e)
        traceback.print_exc()