from transformers import pipeline
from app.models import RequestBody, ProcessedPost

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


def classify_text_and_image(body: RequestBody, image) -> ProcessedPost:
    # Write the AI classification function
    image_pred = image_classifier(image)
    text_pred = text_classifier(body.text)

    # Create Response
    text_class_type = text_pred[0]["label"]
    text_score = text_pred[0]["score"]

    #Create Response (needs to be changed to be custom, or maybe not?)
    image_class_type = image_pred[0]["label"]
    image_score = image_pred[0]["score"]

    weight =  0.9 # Should be customizable :)

    # Set a weighted average for total score
    if text_class_type == "Human" and image_class_type == "real":
        total_score = ((1 - image_score) * weight) + ((1 - text_score) * (1 - weight))

        response = ProcessedPost(post_id=body.post_id, text_score=1 - text_score, image_score=1 - image_score, total_score=total_score)
    elif text_class_type == "Human" and image_class_type != "real":
        total_score = (image_score * weight) + ((1 - text_score) * (1 - weight))

        response = ProcessedPost(post_id=body.post_id,  text_score=1 - text_score, image_score=image_score, total_score=total_score)
    elif text_class_type != "Human" and image_class_type == "real":
        total_score = ((1 - image_score) * weight) + (text_score * (1 - weight))

        response = ProcessedPost(post_id=body.post_id,  text_score=text_score, image_score=1 - image_score, total_score=total_score)
    else:
        total_score = (image_score * weight) + (text_score * (1 - weight))
        response = ProcessedPost(post_id=body.post_id, text_score=text_score, image_score=image_score, total_score=total_score)

    return response


def classify_text(body: RequestBody) -> ProcessedPost:
    text_pred = text_classifier(body.text)

    # Create Response
    text_class_type = text_pred[0]["label"]
    text_score = text_pred[0]["score"]

    if text_class_type == "Human":

        response = ProcessedPost(post_id=body.post_id,  text_score=1 - text_score, image_score=None, total_score=1 - text_score)
    else:

        response = ProcessedPost(post_id=body.post_id,  text_score=text_score, image_score=None, total_score=text_score)
    
    return response