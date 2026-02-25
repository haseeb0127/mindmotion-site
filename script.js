document.addEventListener('DOMContentLoaded', () => {
    // 1. UI Element Selectors
    const generateBtn = document.getElementById('generate-btn');
    const scriptInput = document.getElementById('script-input');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('progress-container');
    const statusDisplay = document.getElementById('status-display');
    const consoleBox = document.getElementById('engine-console');
    const previewBox = document.getElementById('video-preview-box');
    const previewPlayer = document.getElementById('preview-player');
    const downloadBtnLink = document.getElementById('download-btn'); // Matches your HTML ID

    // CONFIG: Connected to your live Railway instance
    const BASE_URL = "https://mindmotion-site-production.up.railway.app"; 

    const logs = [
        "> Swarm Engine: Initializing Psychology Core...",
        "> Extracting NLP keywords from notes...",
        "> Character Lock: Guard HQ Bhaiya Active...",
        "> Rendering visual nodes for MA Psychology content...",
        "> [Gemini 3 Pro] Optimizing scene logic...",
        "> [SynthID] Injecting branded overlays...",
        "> Final export in progress..."
    ];

    // 2. Main Generate Function
    generateBtn.addEventListener('click', async () => {
        const text = scriptInput.value.trim();
        
        // Safety check for inputs
        if (!text) {
            alert("Please enter a script or notes first!");
            return;
        }

        // Prepare UI for processing
        generateBtn.disabled = true;
        progressContainer.style.display = 'block';
        previewBox.style.display = 'none';
        progressBar.style.width = '0%';
        consoleBox.innerHTML += `<br>> Initiating Pro Synthesis Engine...`;

        // Start visual simulation for progress bar
        let progress = 0;
        const progressInterval = setInterval(() => {
            if (progress < 95) {
                progress += Math.floor(Math.random() * 3) + 1;
                progressBar.style.width = `${progress}%`;
            }
            if (Math.random() > 0.8) {
                const log = logs[Math.floor(Math.random() * logs.length)];
                consoleBox.innerHTML += `<br>${log}`;
                consoleBox.scrollTop = consoleBox.scrollHeight;
            }
        }, 800);

        try {
            // STEP 1: Send the job to the backend
            const response = await fetch(`${BASE_URL}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    script: text,
                    format: "16:9",
                    character_lock: "guard_hq" 
                })
            });

            if (!response.ok) throw new Error("Could not connect to Railway server.");
            
            const { job_id } = await response.json();
            consoleBox.innerHTML += `<br>> Job ID Received: ${job_id}`;

            // STEP 2: Poll for Status
            const pollInterval = setInterval(async () => {
                try {
                    const statusRes = await fetch(`${BASE_URL}/status/${job_id}`);
                    const { status } = await statusRes.json();

                    statusDisplay.innerText = `Status: ${status}`;
                    
                    if (status === "Completed") {
                        clearInterval(pollInterval);
                        clearInterval(progressInterval);
                        progressBar.style.width = '100%';
                        
                        const videoUrl = `${BASE_URL}/download/${job_id}`;
                        finalizeVideo(videoUrl);
                    } else if (status.startsWith("Error")) {
                        clearInterval(pollInterval);
                        clearInterval(progressInterval);
                        throw new Error(status);
                    }
                } catch (pollError) {
                    console.error("Polling error:", pollError);
                }
            }, 3000); // Check every 3 seconds

        } catch (error) {
            clearInterval(progressInterval);
            consoleBox.innerHTML += `<br><span style="color:red">> System Error: ${error.message}</span>`;
            statusDisplay.innerText = "❌ Generation Failed";
            generateBtn.disabled = false;
        }
    });

    // 3. Finalize UI and History
    function finalizeVideo(videoUrl) {
        generateBtn.disabled = false;
        statusDisplay.innerText = "✅ Generation Complete!";
        previewBox.style.display = 'block';
        
        // Update Video Player
        previewPlayer.src = videoUrl;
        previewPlayer.load();

        // Update Download Button
        if (downloadBtnLink) {
            downloadBtnLink.href = videoUrl;
            downloadBtnLink.style.display = 'inline-block';
        }
        
        consoleBox.innerHTML += `<br>> SUCCESS: Pro Video rendered and ready.`;
        consoleBox.scrollTop = consoleBox.scrollHeight;
    }
});
