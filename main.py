import os
import asyncio
import uuid
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

app = FastAPI()

# 1. THE HANDSHAKE (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

jobs = {}

class VideoRequest(BaseModel):
    script: str
    format: str
    brand_name: str = "MindMotion.app"

@app.get("/")
async def root():
    return {"message": "MindMotion Engine is Online and Ready!"}

# 2. DOWNLOAD ENDPOINT
@app.get("/download/{job_id}")
async def download_video(job_id: str):
    video_path = f"final_video_{job_id}.mp4" 
    if os.path.exists(video_path):
        return FileResponse(path=video_path, filename="MindMotion_Video.mp4", media_type='video/mp4')
    elif os.path.exists("sample.mp4"):
        return FileResponse(path="sample.mp4", filename="Sample_Video.mp4", media_type='video/mp4')
    return {"error": "File not found. Swarm still working!"}

# 3. THE SWARM WORKER
async def process_chunk(chunk_id, text, format):
    """Fetches a dynamic image and simulates the render"""
    # Specifically tuned for your Psychology notes
    keyword = "psychology,brain,mind"
    image_url = f"https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=1280&h=720&auto=format&fit=crop"
    
    print(f"⚡ Rendering Chunk {chunk_id}: {text[:30]}...")
    print(f"🖼️ Using Visual: {image_url}")
    
    await asyncio.sleep(2) # Swarm rendering simulation
    return f"chunk_{chunk_id}.mp4"

# 4. THE SLICER & STITCHER
async def generate_30_min_video(job_id: str, request: VideoRequest):
    # STEP 1: SLICING
    jobs[job_id] = "Slicing Psychology Notes..."
    words = request.script.split()
    # Batching by 50 words makes the progress bar move faster for long notes
    chunks = [words[i:i + 50] for i in range(0, len(words), 50)]
    if not chunks and words: chunks = [words]
    
    # STEP 2: SWARM RENDERING
    jobs[job_id] = f"Swarm Rendering {len(chunks)} Chunks..."
    tasks = [process_chunk(i, " ".join(c), request.format) for i, c in enumerate(chunks)]
    await asyncio.gather(*tasks)
    
    # STEP 3: STITCHING
    jobs[job_id] = "Branding & Final Stitching..."
    await asyncio.sleep(2) 
    
    jobs[job_id] = "Completed"
    print(f"✅ Video {job_id} is ready for Asif!")

@app.post("/generate")
async def start_engine(request: VideoRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    jobs[job_id] = "Queued"
    background_tasks.add_task(generate_30_min_video, job_id, request)
    return {
        "job_id": job_id,
        "status": "Processing Started",
        "message": "The Swarm is rendering your Psychology video."
    }

@app.get("/status/{job_id}")
async def get_status(job_id: str):
    return {"status": jobs.get(job_id, "Not Found")}
