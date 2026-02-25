import os
import asyncio
import uuid
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# 1. THE HANDSHAKE (CORS)
# This allows your GitHub site (haseeb0127.github.io) to talk to Railway
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# Storage to track the status of each video
jobs = {}

class VideoRequest(BaseModel):
    script: str
    format: str
    brand_name: str = "MindMotion.app"

async def process_chunk(chunk_id, text, format):
    print(f"⚡ Rendering Chunk {chunk_id} in {format}...")
    await asyncio.sleep(2) # Simulating GPU rendering
    return f"chunk_{chunk_id}.mp4"

async def generate_30_min_video(job_id: str, request: VideoRequest):
    jobs[job_id] = "Slicing script into chunks..."
    words = request.script.split()
    chunks = [words[i:i + 150] for i in range(0, len(words), 150)] 
    
    jobs[job_id] = f"Swarm Rendering {len(chunks)} parts..."
    tasks = [process_chunk(i, " ".join(c), request.format) for i, c in enumerate(chunks)]
    await asyncio.gather(*tasks)
    
    jobs[job_id] = "Merging parts & adding watermark..."
    await asyncio.sleep(2)
    
    jobs[job_id] = "Completed"
    print(f"✅ Video {job_id} is ready for download!")

@app.post("/generate")
async def start_engine(request: VideoRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4()) # Unique ID for the user
    jobs[job_id] = "Queued"
    background_tasks.add_task(generate_30_min_video, job_id, request)
    return {"job_id": job_id, "status": "Processing Started"}

@app.get("/status/{job_id}")
async def get_status(job_id: str):
    return {"status": jobs.get(job_id, "Not Found")}
