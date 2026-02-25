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

    generateBtn.addEventListener('click', async () => {
        const text = scriptInput.value.trim();
        if (!text) return alert("Please enter reasoning input first!");

        // 1. Reset UI
        generateBtn.disabled = true;
        progressContainer.style.display = 'block';
        previewBox.style.display = 'none';
        progressBar.style.width = '0%';
        consoleBox.innerHTML = "> Initiating Pro Synthesis Engine...";

        // 2. Prepare URL with Script Parameter
        const url = `${BASE_URL}/generate?script=${encodeURIComponent(text)}`;

        try {
            // 3. Simple POST Request
            const response = await fetch(url, { method: 'POST' });

            if (!response.ok) throw new Error("Could not connect to Railway server.");
            
            const data = await response.json();
            const job_id = data.job_id;
            consoleBox.innerHTML += `<br>> Connected! Job ID: ${job_id}`;

            // 4. Polling for Status
            const pollInterval = setInterval(async () => {
                try {
                    const statusRes = await fetch(`${BASE_URL}/status/${job_id}`);
                    const statusData = await statusRes.json();
                    
                    statusDisplay.innerText = `Status: ${statusData.status}`;

                    if (statusData.status === "Completed") {
                        clearInterval(pollInterval);
                        finalizeVideo(`${BASE_URL}/download/${job_id}`);
                    }
                } catch (e) { console.error("Polling error", e); }
            }, 3000);

        } catch (error) {
            consoleBox.innerHTML += `<br><span style="color:red">> Error: ${error.message}</span>`;
            statusDisplay.innerText = "❌ Generation Failed";
            generateBtn.disabled = false;
        }
    });

    function finalizeVideo(videoUrl) {
        generateBtn.disabled = false;
        progressBar.style.width = '100%';
        statusDisplay.innerText = "✅ Generation Complete!";
        previewBox.style.display = 'block';
        previewPlayer.src = videoUrl;
        previewPlayer.load();
        
        if (downloadBtnLink) {
            downloadBtnLink.href = videoUrl;
            downloadBtnLink.style.display = 'inline-block';
        }
        consoleBox.innerHTML += `<br>> SUCCESS: Pro Video rendered and ready.`;
    }
});
