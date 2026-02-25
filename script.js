document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const scriptInput = document.getElementById('script-input');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('progress-container');
    const statusDisplay = document.getElementById('status-display');
    const consoleBox = document.getElementById('engine-console');
    const previewBox = document.getElementById('video-preview-box');
    const shareHub = document.getElementById('share-hub');
    const historyList = document.getElementById('history-list');

    const logs = [
        "> Swarm Engine: Initializing Psychology Core...",
        "> Extracting NLP keywords from notes...",
        "> Character Lock: Guard HQ Bhaiya Active...",
        "> Rendering visual nodes for MA Psychology content...",
        "> Optimizing bitrate for Swarm distribution...",
        "> Injecting branded overlays...",
        "> Final export in progress..."
    ];

    generateBtn.addEventListener('click', () => {
        const text = scriptInput.value.trim();
        
        if (text === "") {
            alert("Please paste your script or notes first!");
            return;
        }

        // Start Simulation
        generateBtn.disabled = true;
        progressContainer.style.display = 'block';
        previewBox.style.display = 'none';
        shareHub.style.display = 'none';
        let progress = 0;

        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 15) + 5;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                finalizeVideo();
            }

            progressBar.style.width = `${progress}%`;
            statusDisplay.innerText = `Generating Video... ${progress}%`;
            
            // Randomly push logs to console
            if (Math.random() > 0.7) {
                const log = logs[Math.floor(Math.random() * logs.length)];
                consoleBox.innerHTML += `<br>${log}`;
                consoleBox.scrollTop = consoleBox.scrollHeight;
            }
        }, 500);
    });

    function finalizeVideo() {
        generateBtn.disabled = false;
        statusDisplay.innerText = "✅ Generation Complete!";
        previewBox.style.display = 'block';
        shareHub.style.display = 'block';
        consoleBox.innerHTML += `<br>> SUCCESS: Video exported to local storage.`;
        
        // Add to history
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const format = document.getElementById('format-selector').value;
        const li = document.createElement('li');
        li.innerHTML = `<span><strong>${time}</strong> - Psychology Insight (${format})</span> <a href="#" style="color:var(--primary)">View</a>`;
        historyList.prepend(li);
    }

    // Clear History
    document.getElementById('clear-history').addEventListener('click', () => {
        historyList.innerHTML = '';
        consoleBox.innerHTML = "> History Cleared.<br>> Engine Ready.";
    });
});
