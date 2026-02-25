import os
import asyncio
import uuid
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# THE GREETING: Stops the "Not Found" error
@app.get("/")
async def root():
    return {"message": "MindMotion Engine is Online and Ready!"}

# THE HANDSHAKE: Allows haseeb0127.github.io to talk to Railway
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

jobs = {}

class VideoRequest(BaseModel):
    script: str
    format: str

async def process_chunk(chunk_id):
    """Simulates the Swarm rendering"""
    await asyncio.sleep(2) 
    return f"chunk_{chunk_id}.mp4"

async def generate_30_min_video(job_id: str, request: VideoRequest):
    jobs[job_id] = "Slicing Script..."
    await asyncio.sleep(1)
    jobs[job_id] = "Swarm Rendering..."
    tasks = [process_chunk(i) for i in range(5)]
    await asyncio.gather(*tasks)
    jobs[job_id] = "Completed"

@app.post("/generate")
async def start_engine(request: VideoRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    jobs[job_id] = "Started"
    background_tasks.add_task(generate_30_min_video, job_id, request)
    return {"job_id": job_id}

@app.get("/status/{job_id}")
async def get_status(job_id: str):
    return {"status": jobs.get(job_id, "Not Found")}
