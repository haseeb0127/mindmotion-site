import os
import asyncio
import uuid
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

# 1. Initialize the app FIRST
app = FastAPI()

# 2. Add security permissions (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

jobs = {}

@app.get("/")
async def health():
    return {"status": "Engine Online"}

@app.get("/generate")
async def generate(script: str, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    
    # Store BOTH status and a blank URL
    jobs[job_id] = {"status": "Analyzing Psychology Notes...", "url": None}
    
    async def process_sim(jid):
        await asyncio.sleep(4)
        
        # Give it a REAL video URL so the web player actually works!
        jobs[jid]["url"] = "https://www.w3schools.com/html/mov_bbb.mp4"
        jobs[jid]["status"] = "Completed"

    background_tasks.add_task(process_sim, job_id)
    return {"job_id": job_id}

@app.get("/status/{job_id}")
async def status(job_id: str):
    # This automatically returns both the status AND the direct video URL
    return jobs.get(job_id, {"status": "Pending"})

@app.get("/download/{job_id}")
async def download(job_id: str):
    job_info = jobs.get(job_id, {})
    video_url = job_info.get("url", "https://www.w3schools.com/html/mov_bbb.mp4")
    
    # Safely redirect to the actual video file
    return RedirectResponse(url=video_url)
