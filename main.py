import os
import asyncio
import uuid
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# 1. THE HANDSHAKE (CORS)
# This prevents the "Connection Error" by allowing your GitHub site to talk to Railway
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# This dictionary stores the live status of every video job
jobs = {}

class VideoRequest(BaseModel):
    script: str
    format: str
    brand_name: str = "MindMotion.app"

# 2. THE WELCOME ROUTE
# Visit https://your-railway-url.app/ to see if the engine is alive
@app.get("/")
async def root():
    return {"message": "MindMotion Engine is Online and Ready!"}

async def process_chunk(chunk_id, text, format):
    """Simulates a cloud GPU rendering one small part of the video"""
    print(f"⚡ Rendering Chunk {chunk_id} in {format}...")
    await asyncio.sleep(2) # Real rendering logic (FFmpeg/AI) goes here
    return f"chunk_{chunk_id}.mp4"

async def generate_30_min_video(job_id: str, request: VideoRequest):
    # STEP 1: THE SLICER
    jobs[job_id] = "Slicing script into chunks..."
    words = request.script.split()
    # Breaks the script into parts of 150 words each
    chunks = [words[i:i + 150] for i in range(0, len(words), 150)] 
    
    # STEP 2: THE SWARM (Parallel Processing)
    jobs[job_id] = f"Swarm Rendering {len(chunks)} parts..."
    tasks = [process_chunk(i, " ".join(c), request.format) for i, c in enumerate(chunks)]
    
    # asyncio.gather runs all rendering tasks AT THE SAME TIME
    rendered_files = await asyncio.gather(*tasks)
    
    # STEP 3: THE STITCHER
    jobs[job_id] = "Branding & Stitching video..."
    print(f"🎬 Merging {len(rendered_files)} parts with {request.brand_name} watermark...")
    await asyncio.sleep(2) # Simulating the final merge
    
    jobs[job_id] = "Completed"
    print(f"✅ Video {job_id} is ready!")

@app.post("/generate")
async def start_engine(request: VideoRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4()) # Creates a unique ID for the user to track
    jobs[job_id] = "Queued"
    
    # Starts the heavy video work in the background so the website doesn't freeze
    background_tasks.add_task(generate_30_min_video, job_id, request)
    
    return {
        "job_id": job_id,
        "status": "Processing Started",
        "message": "The Swarm is rendering your video."
    }

@app.get("/status/{job_id}")
async def get_status(job_id: str):
    # This is the endpoint the website will ping to see if the video is done
    return {"status": jobs.get(job_id, "Not Found")}
