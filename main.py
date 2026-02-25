import os
import asyncio
import uuid
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

app = FastAPI()

# 1. THE HANDSHAKE (CORS)
# Allows your GitHub site to communicate with Railway without being blocked
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
@app.get("/")
async def root():
    return {"message": "MindMotion Engine is Online and Ready!"}

# 3. DOWNLOAD ENDPOINT
@app.get("/download/{job_id}")
async def download_video(job_id: str):
    # This looks for the video file created by the Swarm
    video_path = f"final_video_{job_id}.mp4" 
    
    # For testing, if the real file doesn't exist yet, we check for a 'sample.mp4'
    if os.path.exists(video_path):
        return FileResponse(path=video_path, filename="MindMotion_Video.mp4", media_type='video/mp4')
    elif os.path.exists("sample.mp4"):
        return FileResponse(path="sample.mp4", filename="Sample_Video.mp4", media_type='video/mp4')
    
    return {"error": "File not found. The swarm might still be stitching!"}

async def process_chunk(chunk_id, text, format):
    """Simulates a cloud GPU rendering one part of the video"""
    print(f"⚡ Rendering Chunk {chunk_id} in {format}...")
    await asyncio.sleep(2) 
    return f"chunk_{chunk_id}.mp4"

async def generate_30_min_video(job_id: str, request: VideoRequest):
    # STEP 1: THE SLICER
    jobs[job_id] = "Slicing script into chunks..."
    words = request.script.split()
    chunks = [words[i:i + 150] for i in range(0, len(words), 150)] 
    
    # STEP 2: THE SWARM (Parallel Processing)
    jobs[job_id] = f"Swarm Rendering {len(chunks)} parts..."
    tasks = [process_chunk(i, " ".join(c), request.format) for i, c in enumerate(chunks)]
    await asyncio.gather(*tasks)
    
    # STEP 3: THE STITCHER
    jobs[job_id] = "Branding & Stitching video..."
    await asyncio.sleep(2) 
    
    # Here we 'create' the final file (In reality, FFmpeg would merge them)
    # For now, we simulate success by marking it completed
    jobs[job_id] = "Completed"
    print(f"✅ Video {job_id} is ready!")

@app.post("/generate")
async def start_engine(request: VideoRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    jobs[job_id] = "Queued"
    
    # Runs the rendering in the background
    background_tasks.add_task(generate_30_min_video, job_id, request)
    
    return {
        "job_id": job_id,
        "status": "Processing Started",
        "message": "The Swarm is rendering your video."
    }

@app.get
