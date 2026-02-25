import os
import uuid
import shutil
import asyncio
import httpx
from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, RedirectResponse
from moviepy.editor import VideoFileClip, concatenate_videoclips, CompositeVideoClip
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
FAL_KEY = os.getenv("FAL_KEY", "")
MERGE_DIR = "temp_merges"
if not os.path.exists(MERGE_DIR):
    os.makedirs(MERGE_DIR)

jobs = {}

@app.get("/")
async def health():
    return {"status": "MindMotion Engine Online"}

# --- AI GENERATION ENDPOINT ---
@app.get("/generate")
async def generate(script: str, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    jobs[job_id] = {"status": "Initializing Pro Engine...", "url": None, "attempts": 0}
    
    async def process_video(jid, prompt_text):
        url = "https://queue.fal.run/fal-ai/minimax-video"
        headers = {"Authorization": f"Key {FAL_KEY}", "Content-Type": "application/json"}
        payload = {"prompt": f"Cinematic 4K, high detail, {prompt_text}"}

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(url, json=payload, headers=headers)
                if response.status_code != 200:
                    jobs[jid]["status"] = "API Error: Check credits."
                    return
                
                request_id = response.json().get("request_id")
                while True:
                    await asyncio.sleep(5)
                    status_check = await client.get(f"{url}/requests/{request_id}", headers=headers)
                    data = status_check.json()
                    if data.get("status") == "COMPLETED":
                        jobs[jid]["url"] = data.get("video", {}).get("url")
                        jobs[jid]["status"] = "Completed"
                        break
        except Exception as e:
            jobs[jid]["status"] = f"Error: {str(e)}"

    background_tasks.add_task(process_video, job_id, script)
    return {"job_id": job_id}

@app.get("/status/{job_id}")
async def status(job_id: str):
    return jobs.get(job_id, {"status": "Pending"})

# --- MULTI-CLIP MERGER ENDPOINT ---
@app.post("/merge")
async def merge_videos(files: List[UploadFile] = File(...)):
    job_id = str(uuid.uuid4())
    job_path = os.path.join(MERGE_DIR, job_id)
    os.makedirs(job_path)
    
    saved_paths = []
    for file in files:
        file_path = os.path.join(job_path, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        saved_paths.append(file_path)

    try:
        video_clips = [VideoFileClip(p) for p in saved_paths]
        fade_duration = 1.0
        final_clips = []
        
        # Apply Cinematic Cross-Fade
        for i, clip in enumerate(video_clips):
            if i == 0:
                final_clips.append(clip.crossfadeout(fade_duration))
            else:
                start_time = sum(c.duration for c in video_clips[:i]) - (i * fade_duration)
                final_clips.append(clip.set_start(start_time).crossfadein(fade_duration).crossfadeout(fade_duration))

        final_video = CompositeVideoClip(final_clips)
        output_filename = f"merged_{job_id}.mp4"
        output_path = os.path.join(MERGE_DIR, output_filename)
        
        final_video.write_videofile(output_path, codec="libx264", audio_codec="aac", fps=24)
        
        # Cleanup
        for clip in video_clips: clip.close()
        shutil.rmtree(job_path)
        
        return {"download_url": f"/download-merged/{output_filename}"}
    except Exception as e:
        return {"error": str(e)}

@app.get("/download-merged/{filename}")
async def download_merged(filename: str):
    return FileResponse(os.path.join(MERGE_DIR, filename), media_type="video/mp4")
