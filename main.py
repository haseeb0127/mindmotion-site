import os
import asyncio
import uuid
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

app = FastAPI()

# THE ULTIMATE OPEN GATE
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

jobs = {}

@app.get("/")
async def health():
    return {"status": "Engine Online"}

@app.post("/generate")
async def generate(script: str, background_tasks: BackgroundTasks):
    # This captures the 'script' directly from the URL link
    job_id = str(uuid.uuid4())
    jobs[job_id] = "Analyzing Psychology Nodes..."
    
    async def process_sim(jid):
        await asyncio.sleep(5)
        # Create a dummy file for testing
        with open(f"video_{jid}.mp4", "w") as f: f.write("4K Render")
        jobs[jid] = "Completed"

    background_tasks.add_task(process_sim, job_id)
    return {"job_id": job_id}

@app.get("/status/{job_id}")
async def status(job_id: str):
    return {"status": jobs.get(job_id, "Pending")}

@app.get("/download/{job_id}")
async def download(job_id: str):
    return FileResponse(f"video_{job_id}.mp4", filename="Render.mp4")
