import os
import asyncio
import uuid
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from gradio_client import Client

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

jobs = {}

# MODELS TO ROTATE (If one is full, we try the next)
ENGINES = [
    "Wan-AI/Wan2.2-5B", 
    "Kwai-VGI/Wan2.1-T2V-1.3B"
]

@app.get("/generate")
async def generate(script: str, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    jobs[job_id] = {"status": "Scanning for available GPUs...", "url": None}
    
    async def run_resilient_task(jid, user_script):
        # We try each engine in our list
        for engine in ENGINES:
            try:
                jobs[jid]["status"] = f"Trying Engine: {engine.split('/')[-1]}..."
                client = Client(engine)
                
                # Standard parameters for fastest free-tier processing
                result = client.predict(
                    prompt=f"Cinematic 4K, {user_script}",
                    api_name="/predict"
                )
                
                jobs[jid]["url"] = result
                jobs[jid]["status"] = "Completed"
                return # Exit once successful!

            except Exception as e:
                print(f"Engine {engine} busy: {e}")
                continue # Try the next engine in the list
        
        # If all engines fail
        jobs[jid]["status"] = "All engines busy. Retrying in 60s..."

    background_tasks.add_task(run_resilient_task, job_id, script)
    return {"job_id": job_id}

@app.get("/status/{job_id}")
async def status(job_id: str):
    return jobs.get(job_id, {"status": "Pending"})
