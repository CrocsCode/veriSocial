from fastapi import FastAPI
from app.routers.classify import router as classify_router
from app.config import settings
from app.worker import start_worker, stop_worker, queue

app = FastAPI(title="AI Content Detector")
app.include_router(classify_router)


@app.on_event("startup")
async def startup_event():
    print(settings)
    start_worker()

@app.on_event("shutdown")
async def on_shutdown():
    # End remaning processes
    await queue.join()
    await stop_worker()