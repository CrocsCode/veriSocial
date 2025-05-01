from typing import Optional
from pydantic import BaseModel

class RequestBody(BaseModel):
    post_id: int
    text: str
    image_url: Optional[str]

class ProcessedPost(BaseModel):
    post_id: int
    text_score: float
    image_score: float | None
    total_score: float