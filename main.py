from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid

app = FastAPI()

# Enable CORS so your GitHub Pages can talk to Railway
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, we'll change this to haseeb-mindmotion.github.io
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store for job status (we'll move to a database later)
jobs = {}

def process_video_slicer(job_id, script, format):
    """
    The 'Slicer' logic: 
    1. Splits text 
    2. Generates chunks 
    3. Adds logo.png watermark 
    4. Stitches with FFmpeg
    """
    jobs[job_id] = "Slicing Script..."
    # AI Generation Logic goes here...
    
    # Placeholder for the FFmpeg branding command
    # os.system(f"ffmpeg -i input.mp4 -i logo.png -filter_complex 'overlay=W-w-20:H-h-20' branded.mp4")
    
    jobs[job_id] = "Completed"

@app.post("/generate")
async def generate(data: dict, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    script = data.get("script")
    format = data.get("format")
    
    jobs[job_id] = "Queued"
    background_tasks.add_task(process_video_slicer, job_id, script, format)
    
    return {"job_id": job_id, "status": "Processing"}

@app.get("/status/{job_id}")
async def get_status(job_id: str):
    return {"status": jobs.get(job_id, "Not Found")}
