document.addEventListener('DOMContentLoaded', () => {
    // UI Element Selectors
    const generateBtn = document.getElementById('generate-btn');
    const scriptInput = document.getElementById('script-input');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('progress-container');
    const statusDisplay = document.getElementById('status-display');
    const consoleBox = document.getElementById('engine-console');
    const previewBox = document.getElementById('video-preview-box');
    const shareHub = document.getElementById('share-hub');
    const historyList = document.getElementById('history-list');
    const previewPlayer = document.getElementById('preview-player');

    const logs = [
        "> Swarm Engine: Initializing Psychology Core...",
        "> Extracting NLP keywords from notes...",
        "> Character Lock: Guard HQ Bhaiya Active...",
        "> Rendering visual nodes for MA Psychology content...",
        "> Optimizing bitrate for Swarm distribution...",
        "> Injecting branded overlays...",
        "> Final export in progress..."
    ];

    // Main Generate Function
    generateBtn.addEventListener('click', async () => {
        const text = scriptInput.value.trim();
        const format = document.getElementById('format-selector').value;
        const character = document.getElementById('char-lock').value;

        if (!text) {
            alert("Please enter a script or notes first!");
            return;
        }

        // 1. Prepare UI
        generateBtn.disabled = true;
        progressContainer.style.display = 'block';
        previewBox.style.display = 'none';
        shareHub.style.display = 'none';
        progressBar.style.width = '0%';
        consoleBox.innerHTML += `<br>> Connecting to Swarm Engine at Railway...`;

        // 2. Start Visual Simulation (Logs and Progress Bar)
        let progress = 0;
        const progressInterval = setInterval(() => {
            if (progress < 90) { // Hold at 90% until server responds
                progress += Math.floor(Math.random() * 5) + 1;
                progressBar.style.width = `${progress}%`;
                statusDisplay.innerText = `Processing Swarm Nodes... ${progress}%`;
            }
            if (Math.random() > 0.8) {
                const log = logs[Math.floor(Math.random() * logs.length)];
                consoleBox.innerHTML += `<br>${log}`;
                consoleBox.scrollTop = consoleBox.scrollHeight;
            }
        }, 600);

        // 3. Actual Backend Request
        try {
            // REPLACE the URL below with your actual Railway App URL after deployment
            const response = await fetch('https://your-railway-url.app/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    script: text,
                    format: format,
                    character: character
                })
            });

            if (!response.ok) throw new Error("Server connection failed");

            const data = await response.json();

            if (data.video_url) {
                clearInterval(progressInterval);
                progressBar.style.width = '100%';
                finalizeVideo(data.video_url, format);
            } else {
                throw new Error("Video URL not received from Swarm Engine");
            }

        } catch (error) {
            clearInterval(progressInterval);
            consoleBox.innerHTML += `<br><span style="color:red">> Error: ${error.message}</span>`;
            statusDisplay.innerText = "❌ Generation Failed";
            generateBtn.disabled = false;
        }
    });

    function finalizeVideo(videoUrl, format) {
        generateBtn.disabled = false;
        statusDisplay.innerText = "✅ Generation Complete!";
        previewBox.style.display = 'block';
        shareHub.style.display = 'block';
        
        // Update Video Player
        previewPlayer.src = videoUrl;
        previewPlayer.load();
        
        consoleBox.innerHTML += `<br>> SUCCESS: Video exported to cloud storage.`;
        consoleBox.scrollTop = consoleBox.scrollHeight;
        
        // Add to history
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const li = document.createElement('li');
        li.innerHTML = `<span><strong>${time}</strong> - Psychology Insight (${format})</span> <a href="${videoUrl}" target="_blank" style="color:var(--primary)">Download</a>`;
        historyList.prepend(li);
    }

    // Clear History Logic
    document.getElementById('clear-history').addEventListener('click', () => {
        historyList.innerHTML = '';
        consoleBox.innerHTML = "> History Cleared.<br>> Engine Ready.";
    });
});
