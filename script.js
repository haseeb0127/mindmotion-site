const BACKEND_URL = "https://mindmotion-site-production.up.railway.app";

document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.querySelector('#generate-btn');
    const statusText = document.querySelector('#status-display');
    const scriptInput = document.querySelector('#script-input');
    const progressBar = document.querySelector('#progress-bar');
    const progressContainer = document.querySelector('#progress-container');
    const previewBox = document.getElementById('video-preview-box');
    const previewPlayer = document.getElementById('preview-player');
    const shareHub = document.getElementById('share-hub');
    const clearHistoryBtn = document.getElementById('clear-history');

    function updateConsole(msg) {
        const consoleBox = document.querySelector('#engine-console');
        if (consoleBox) {
            const time = new Date().toLocaleTimeString([], { hour12: false });
            consoleBox.innerHTML += `> [${time}] ${msg}<br>`;
            consoleBox.scrollTop = consoleBox.scrollHeight;
        }
    }

    async function startEngineFlow() {
        const script = scriptInput.value;
        const format = document.querySelector('#format-selector').value;

        if (!script) {
            alert("Asif, please enter your Psychology notes first!");
            return;
        }

        statusText.innerText = "🚀 Connecting to Swarm...";
        updateConsole("System Override: Manual Start Initiated.");
        if (previewBox) previewBox.style.display = "none"; 
        if (shareHub) shareHub.style.display = "none";
        
        generateBtn.disabled = true;
        progressContainer.style.display = "block";
        progressBar.style.width = "5%";

        try {
            const response = await fetch(`${BACKEND_URL}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ script, format })
            });
            const data = await response.json();
            if (data.job_id) {
                updateConsole(`Job ID Created: ${data.job_id}`);
                pollStatus(data.job_id);
            }
        } catch (error) {
            statusText.innerText = "❌ Connection Error!";
            updateConsole("ERROR: Failed to reach the Swarm engine.");
            generateBtn.disabled = false;
        }
    }

    if (generateBtn) {
        generateBtn.onclick = startEngineFlow;
    }

    async function pollStatus(jobId) {
        let lastStatus = "";
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/status/${jobId}`);
                const data = await res.json();

                if (data.status !== lastStatus) {
                    updateConsole(`System Update: ${data.status}`);
                    lastStatus = data.status;
                }

                let progress = 10;
                if (data.status.includes("Slicing")) progress = 25;
                else if (data.status.includes("Rendering")) progress = 65;
                else if (data.status.includes("Stitching")) progress = 90;
                else if (data.status === "Completed") {
                    progress = 100;
                    clearInterval(interval);
                    
                    const videoUrl = `${BACKEND_URL}/download/${jobId}`;

                    if (previewBox && previewPlayer) {
                        previewBox.style.display = "block";
                        previewPlayer.src = videoUrl;
                        previewPlayer.load();
                        updateConsole("Visual Preview Generated.");
                    }

                    saveToHistory(videoUrl);

                    if (shareHub) {
                        const whatsappBtn = document.getElementById('share-whatsapp');
                        const twitterBtn = document.getElementById('share-twitter');
                        const copyBtn = document.getElementById('copy-link-btn');
                        const shareMsg = encodeURIComponent("Check out my MA Psychology video! 🧠");
                        
                        whatsappBtn.href = `https://api.whatsapp.com/send?text=${shareMsg}%20${videoUrl}`;
                        twitterBtn.href = `https://twitter.com/intent/tweet?text=${shareMsg}&url=${videoUrl}`;

                        copyBtn.onclick = () => {
                            navigator.clipboard.writeText(videoUrl).then(() => {
                                const originalText = copyBtn.innerText;
                                copyBtn.innerText = "✅ Copied!";
                                updateConsole("URL copied to clipboard.");
                                setTimeout(() => { copyBtn.innerText = originalText; }, 2000);
                            });
                        };
                        shareHub.style.display = "block";
                    }

                    statusText.innerHTML = `
                        <div style="color: #008080; font-weight: bold; margin-top: 10px;">
                            ✅ Video Ready! <br>
                            <a href="${videoUrl}" class="download-btn" target="_blank" style="display:inline-block; margin-top:10px; background:#008080; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">
                                📥 Download Branded Video
                            </a>
                        </div>
                    `;
                    updateConsole("SUCCESS: All systems clear.");
                    generateBtn.disabled = false;
                }

                progressBar.style.width = progress + "%";
                if (data.status !== "Completed") {
                    statusText.innerText = "📊 " + data.status;
                }
            } catch (err) { console.log("Checking..."); }
        }, 2000); 
    }

    function saveToHistory(url) {
        let history = JSON.parse(localStorage.getItem('videoHistory')) || [];
        history.unshift({ url: url, date: new Date().toLocaleString() });
        history = history.slice(0, 3);
        localStorage.setItem('videoHistory', JSON.stringify(history));
        updateHistoryUI();
    }

    function updateHistoryUI() {
        let history = JSON.parse(localStorage.getItem('videoHistory')) || [];
        const historyList = document.getElementById('history-list');
        if (historyList) {
            historyList.innerHTML = history.map(item => 
                `<li style="margin-bottom: 8px;">
                    <a href="${item.url}" target="_blank">🎥 Video: ${item.date}</a>
                </li>`
            ).join('');
        }
    }

    if (clearHistoryBtn) {
        clearHistoryBtn.onclick = () => {
            if (confirm("Asif, clear your video history?")) {
                localStorage.removeItem('videoHistory');
                updateHistoryUI();
                updateConsole("History cleared.");
            }
        };
    }
    updateHistoryUI();
});
