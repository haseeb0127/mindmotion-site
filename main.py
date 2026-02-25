import os
import uuid
import asyncio
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# CRITICAL: This allows your GitHub Pages site to access this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoRequest(BaseModel):
    script: str
    format: str
    brand_name: str = "MindMotion.app"

# Global dictionary to track video progress
jobs = {}

async def process_chunk(chunk_id, text, format):
    # This is where the AI GPU/FFmpeg logic will eventually sit
    print(f"⚡ Rendering Chunk {chunk_id} in {format}...")
    await asyncio.sleep(5) # Simulating hard work
    return f"chunk_{chunk_id}.mp4"

async def generate_30_min_video(job_id: str, request: VideoRequest):
    jobs[job_id] = "Slicing Script..."
    words = request.script.split()
    chunks = [words[i:i + 150] for i in range(0, len(words), 150)] 
    
    jobs[job_id] = f"Rendering {len(chunks)} Chunks..."
    tasks = [process_chunk(i, " ".join(c), request.format) for i, c in enumerate(chunks)]
    rendered_files = await asyncio.gather(*tasks)
    
    jobs[job_id] = "Stitching & Watermarking..."
    # FFmpeg stitching logic would go here
    await asyncio.sleep(2)
    
    jobs[job_id] = "Completed"
    print(f"✅ Job {job_id} Finished!")

@app.post("/generate")
async def start_engine(request: VideoRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    jobs[job_id] = "Queued"
    background_tasks.add_task(generate_30_min_video, job_id, request)
    return {"job_id": job_id, "status": "Processing Started"}

@app.get("/status/{job_id}")
async def get_status(job_id: str):
    return {"status": jobs.get(job_id, "Not Found")}
