import os
import asyncio
import uuid
from fastapi import FastAPI, BackgroundTasks, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from typing import Optional

app = FastAPI()

# 1. ALLOW GITHUB TO TALK TO RAILWAY
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

jobs = {}

# 2. THE NANO BANANA PROCESSING LOGIC
async def process_video_with_image(job_id: str, script: str, has_image: bool):
    try:
        jobs[job_id] = "Analyzing Psychology Nodes..."
        await asyncio.sleep(2)
        
        if has_image:
            jobs[job_id] = "[Nano Banana] Locking Character Consistency..."
            await asyncio.sleep(3)
        
        jobs[job_id] = "GemPix 2 Diffusion Rendering..."
        await asyncio.sleep(4)
        
        jobs[job_id] = "Completed"
        
        # Create a dummy video file
        video_path = f"video_{job_id}.mp4"
        with open(video_path, "w") as f:
            f.write("Pro 4K Render")
            
    except Exception as e:
        jobs[job_id] = f"Error: {str(e)}"

# 3. UPDATED ROUTES FOR IMAGE UPLOADS
@app.post("/generate")
async def generate(
    background_tasks: BackgroundTasks,
    script: str = Form(...),
    format: str = Form("16:9"),
    reference_image: Optional[UploadFile] = File(None)
):
    job_id = str(uuid.uuid4())
    jobs[job_id] = "Queued"
    
    # Check if a character image was actually uploaded
    has_image = reference_image is not None
    
    background_tasks.add_task(process_video_with_image, job_id, script, has_image)
    return {"job_id": job_id}

@app.get("/status/{job_id}")
async def status(job_id: str):
    return {"status": jobs.get(job_id, "Not Found")}

@app.get("/download/{job_id}")
async def download(job_id: str):
    video_path = f"video_{job_id}.mp4"
    if os.path.exists(video_path):
        return FileResponse(video_path, media_type="video/mp4", filename="MindMotion_Render.mp4")
    return {"error": "File not found"}
