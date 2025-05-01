from transformers import pipeline
from app.schemas import RequestBody, ProcessedPost

# Initialize pipelines (device can be set via env)
image_classifier = pipeline(
    "image-classification",
    model="NYUAD-ComNets/AI-generated_images_detector",
    device="cpu"
)
text_classifier = pipeline(
    "text-classification",
    model="fakespot-ai/roberta-base-ai-text-detection-v1",
    device="cpu"
)


def classify(body: RequestBody, image) -> ProcessedPost:
    image_pred = image_classifier(image)
    text_pred = text_classifier(body.text)

    text_score = text_pred[0]["score"]
    image_score = image_pred[0]["score"]
    weight = 0.5

    # Compute weighted total
    total_score = (image_score * weight + text_score * (1 - weight)) / 2

    return ProcessedPost(
        post_id=body.post_id,
        text_score=text_score,
        image_score=image_score,
        total_score=total_score,
    )