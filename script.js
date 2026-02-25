const BACKEND_URL = "https://mindmotion-site-production.up.railway.app";

document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.querySelector('#generate-btn');
    const statusText = document.querySelector('#status-display');
    const scriptInput = document.querySelector('#script-input');

    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const script = scriptInput.value;
            const format = document.querySelector('#format-selector').value;

            if (!script) {
                alert("Asif, please enter a script first!");
                return;
            }

            // 1. INSTANT FEEDBACK (Make the UI feel fast)
            statusText.innerText = "🚀 Connection established... Engine warming up.";
            generateBtn.disabled = true;
            generateBtn.innerText = "Processing...";

            try {
                // 2. TRIGGER THE SWARM
                const response = await fetch(`${BACKEND_URL}/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ script, format })
                });

                const data = await response.json();
                
                if (data.job_id) {
                    statusText.innerText = "⚙️ Swarm Engine Active. Rendering chunks...";
                    // 3. START POLLING (Check status every 2 seconds)
                    pollStatus(data.job_id);
                }
            } catch (error) {
                statusText.innerText = "❌ Connection Error. Is Railway awake?";
                generateBtn.disabled = false;
                generateBtn.innerText = "Generate Branded Video";
            }
        });
    }

    async function pollStatus(jobId) {
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/status/${jobId}`);
                const data = await res.json();

                if (data.status === "Completed") {
                    clearInterval(interval);
                    statusText.innerHTML = `
                        <div style="color: #008080; font-weight: bold;">
                            ✅ Video Completed! <br>
                            <a href="#" class="download-btn" style="display:inline-block; margin-top:10px; background:#008080; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">
                                📥 Download Branded Video
                            </a>
                        </div>
                    `;
                    document.querySelector('#generate-btn').disabled = false;
                    document.querySelector('#generate-btn').innerText = "Generate Another Video";
                } else {
                    statusText.innerText = "📊 Current Task: " + data.status;
                }
            } catch (err) {
                console.log("Checking status...");
            }
        }, 2000); // Check every 2 seconds
    }
});
