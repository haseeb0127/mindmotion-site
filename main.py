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

# THE UNLIMITED ENGINE: Official Wan2.2 5B Space
HF_SPACE_ID = "Wan-AI/Wan2.2-5B" 

@app.get("/generate")
async def generate(script: str, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    jobs[job_id] = {"status": "Connecting to ZeroGPU Cluster...", "url": None}
    
    async def run_wan_video(jid, user_script):
        try:
            # Connect to the Hugging Face Space
            client = Client(HF_SPACE_ID)
            
            jobs[jid]["status"] = "AI is thinking (Queueing on ZeroGPU)..."
            
            # Pinging the Wan2.2 API
            # Note: 480p is recommended for the fastest free-tier rendering
            result = client.predict(
                prompt=f"Cinematic 4K, high detail, {user_script}",
                resolution="480p", 
                api_name="/predict"
            )
            
            # Result is the direct path to the .mp4
            jobs[jid]["url"] = result
            jobs[jid]["status"] = "Completed"
            
        except Exception as e:
            jobs[jid]["status"] = "Queue Full. Retrying in 30s..."
            print(f"HF Error: {e}")

    background_tasks.add_task(run_wan_video, job_id, script)
    return {"job_id": job_id}

@app.get("/status/{job_id}")
async def status(job_id: str):
    return jobs.get(job_id, {"status": "Pending"})
