import os
import asyncio
import uuid
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# 1. THE HANDSHAKE (CORS)
# This is required so your browser allows the website to talk to Railway
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dictionary to store the status of each video rendering job
jobs = {}

class VideoRequest(BaseModel):
    script: str
    format: str
    brand_name: str = "MindMotion.app"

async def process_chunk(chunk_id, text, format):
    """Simulates a cloud GPU rendering one small part of the 30-minute video"""
    print(f"⚡ Rendering Chunk {chunk_id} in {format}...")
    await asyncio.sleep(2) # Real rendering logic goes here
    return f"chunk_{chunk_id}.mp4"

async def generate_30_min_video(job_id: str, request: VideoRequest):
    # 1. THE SLICER
    jobs[job_id] = "Slicing Script into chunks..."
    words = request.script.split()
    chunks = [words[i:i + 150] for i in range(0, len(words), 150)] 
    
    # 2. THE SWARM
    jobs[job_id] = f"Swarm Rendering {len(chunks)} parts..."
    tasks = [process_chunk(i, " ".join(c), request.format) for i, c in enumerate(chunks)]
    rendered_files = await asyncio.gather(*tasks)
    
    # 3. THE STITCHER
    jobs[job_id] = "Branding & Stitching..."
    print(f"🎬 Merging {len(rendered_files)} parts with {request.brand_name}...")
    await asyncio.sleep(2)
    
    jobs[job_id] = "Completed"
    print(f"✅ Video {job_id} is ready!")

@app.post("/generate")
async def start_engine(request: VideoRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    jobs[job_id] = "Queued"
    
    background_tasks.add_task(generate_30_min_video, job_id, request)
    
    return {
        "job_id": job_id,
        "status": "Processing Started",
        "message": "The Swarm is rendering your video."
    }

@app.get("/status/{job_id}")
async def get_status(job_id: str):
    return {"status": jobs.get(job_id, "Not Found")}
