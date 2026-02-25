import os
import asyncio
import uuid
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

# 1. Initialize the app
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

@app.post("/generate")
async def generate(script: str, background_tasks: BackgroundTasks):
    # This captures 'script' from the URL: /generate?script=your_text
    job_id = str(uuid.uuid4())
    jobs[job_id] = "Analyzing Psychology Nodes..."
    
    async def process_sim(jid):
        await asyncio.sleep(5)
        video_path = f"video_{jid}.mp4"
        with open(video_path, "w") as f: 
            f.write("4K Render Output")
        jobs[jid] = "Completed"

    background_tasks.add_task(process_sim, job_id)
    return {"job_id": job_id}

@app.get("/status/{job_id}")
async def status(job_id: str):
    return {"status": jobs.get(job_id, "Pending")}

@app.get("/download/{job_id}")
async def download(job_id: str):
    video_path = f"video_{job_id}.mp4"
    if os.path.exists(video_path):
        return FileResponse(video_path, filename="MindMotion_Render.mp4")
    return {"error": "File not found"}
