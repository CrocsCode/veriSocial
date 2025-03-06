import base64
from fastapi import FastAPI
from pydantic import BaseModel
from PIL import Image
from io import BytesIO
from transformers import pipeline

# Simple body
class RequestBody(BaseModel):
    post_id: int
    base64_image: str

class ResponseBody(BaseModel):
    post_id: int
    class_type: str
    score: float

# AI initialization
# Downloads model everytime again (not that good for now)
classifier = pipeline("image-classification", model="NYUAD-ComNets/AI-generated_images_detector", device="cpu")

# App initialization
app = FastAPI()

@app.post("/classify")
async def classify(body: RequestBody):
    # Check if body is in standard.
    image_data = base64.b64decode(body.base64_image) # decode the image data
    image_file = BytesIO(image_data)
    image = Image.open(image_file)

    # Write the AI classification function
    pred = classifier(image)

    #Create Response
    class_type = pred[0]["label"]
    score = pred[0]["score"]

    response = ResponseBody(post_id=body.post_id, class_type=class_type, score=score)

    return response