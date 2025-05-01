from fastapi import APIRouter
from app.schemas import RequestBody
from app.worker import queue

router = APIRouter()

@router.post("/classify")
async def enqueue(body: RequestBody):
    await queue.put(body)
    return {"status": "accepted"}