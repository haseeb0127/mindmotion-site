document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const scriptInput = document.getElementById('script-input');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('progress-container');
    const statusDisplay = document.getElementById('status-display');
    const consoleBox = document.getElementById('engine-console');
    const previewBox = document.getElementById('video-preview-box');
    const previewPlayer = document.getElementById('preview-player');
    const downloadBtnLink = document.getElementById('download-btn');

    // YOUR ACTUAL RAILWAY BACKEND URL
    const BASE_URL = "https://mindmotion-site-production.up.railway.app"; 

    // 1. Unified Finalize Function
    function finalizeVideo(videoUrl) {
        generateBtn.disabled = false;
        progressBar.style.width = '100%';
        statusDisplay.innerText = "✅ Synthesis Complete!";
        
        previewBox.style.display = 'block';
        
        // 2. Browser Autoplay Fix: Videos MUST be muted to autoplay successfully
        previewPlayer.muted = true;
        previewPlayer.setAttribute('playsinline', 'true');
        previewPlayer.setAttribute('autoplay', 'true');
        previewPlayer.setAttribute('controls', 'true');
        
        previewPlayer.src = videoUrl;
        previewPlayer.load();
        
        // 3. Play the video
        let playPromise = previewPlayer.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay blocked, user must click play.");
            });
        }

        // 4. Set Download Link
        if (downloadBtnLink) {
            downloadBtnLink.href = videoUrl;
            downloadBtnLink.style.display = 'inline-block';
        }
        
        consoleBox.innerHTML += `<br>> [Stream] Cinematic sequence synchronized. Enjoy.`;
    }

    generateBtn.addEventListener('click', async () => {
        const text = scriptInput.value.trim();
        if (!text) return alert("Please enter reasoning input first!");

        // Reset UI
        generateBtn.disabled = true;
        progressContainer.style.display = 'block';
        previewBox.style.display = 'none';
        progressBar.style.width = '0%';
        consoleBox.innerHTML = "> Initiating Pro Synthesis Engine...";

        // Prepare URL with Script Parameter (Using GET)
        const url = `${BASE_URL}/generate?script=${encodeURIComponent(text)}`;

        try {
            // Simple GET Request to match main.py
            const response = await fetch(url);

            if (!response.ok) throw new Error("Could not connect to Railway server.");
            
            const data = await response.json();
            const job_id = data.job_id;
            consoleBox.innerHTML += `<br>> Connected! Job ID: ${job_id}`;

            // Polling for Status
            const pollInterval = setInterval(async () => {
                try {
                    const statusRes = await fetch(`${BASE_URL}/status/${job_id}`);
                    const statusData = await statusRes.json();
                    
                    statusDisplay.innerText = `Status: ${statusData.status}`;

                    if (statusData.status === "Completed") {
                        clearInterval(pollInterval);
                        
                        // Use the direct URL from the server, or fallback to test video
                        const finalUrl = statusData.url || "https://www.w3schools.com/html/mov_bbb.mp4";
                        finalizeVideo(finalUrl); 
                    }
                } catch (e) { 
                    console.error("Polling error", e); 
                }
            }, 3000);

        } catch (error) {
            consoleBox.innerHTML += `<br><span style="color:red">> Error: ${error.message}</span>`;
            statusDisplay.innerText = "❌ Generation Failed";
            generateBtn.disabled = false;
        }
    });
});
