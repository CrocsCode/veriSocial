import asyncio
import traceback
from io import BytesIO
from PIL import Image
from botocore.exceptions import ClientError

from app.models import RequestBody
from app.classifier import classify_text, classify_text_and_image
from app.s3_client import s3
from app.db import get_db_connection
from app.models import ProcessedPost

queue: asyncio.Queue[RequestBody] = asyncio.Queue()

worker_task: asyncio.Task | None = None

async def get_image(image_url: str):
    try:
        key = image_url.split('/')[-1]

        resp = s3.get_object(
            Bucket=s3.meta.endpoint_url.split("//")[1].split('.')[0],
            Key=key
        )

        data = resp['Body'].read()
        return Image.open(BytesIO(data))
    except ClientError as e:
        print(f"Error fetching image {image_url}: {e}")
        return None

async def update_post_score(post: ProcessedPost):
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            if post.image_score:
                cursor.execute(
                    "UPDATE posts SET bot_score=%s, text_bot_score=%s, image_bot_score=%s WHERE post_id=%s",
                    (post.total_score, post.text_score, post.image_score, post.post_id),
                )
            else:
                cursor.execute(
                    "UPDATE posts SET bot_score=%s, text_bot_score=%s WHERE post_id=%s",
                    (post.total_score, post.text_score, post.post_id),
                )
            conn.commit()
            cursor.close()
    except Exception:
        traceback.print_exc()

async def classifier_worker():
    loop = asyncio.get_running_loop()
    while True:
        try:
            req = await queue.get()
        except asyncio.CancelledError:
            break

        try:
            # Needs to be revised
            img = None
            if req.image_url:
                img = await get_image(req.image_url)
                result = await loop.run_in_executor(None, classify_text_and_image, req, img)
            else:
                result = await loop.run_in_executor(None, classify_text, req)

            await update_post_score(result)
        except Exception:
            print(f"Error processing {req.post_id}")
            traceback.print_exc()
        finally:
            queue.task_done()


def start_worker():
    asyncio.get_event_loop().create_task(classifier_worker())

async def stop_worker():
    global worker_task
    if worker_task and not worker_task.done():
        worker_task.cancel()
        try:
            await worker_task
        except asyncio.CancelledError:
            pass