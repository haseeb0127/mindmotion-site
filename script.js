const BACKEND_URL = "https://mindmotion-site-production.up.railway.app";

document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.querySelector('#generate-btn');
    const statusText = document.querySelector('#status-display');
    const scriptInput = document.querySelector('#script-input');

    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const script = scriptInput.value;
            const format = document.querySelector('#format-selector')?.value || "16:9";

            if (!script) {
                alert("Please enter a script first!");
                return;
            }

            // 1. Update UI to show we started
            statusText.innerText = "🚀 Sending to MindMotion Engine...";
            generateBtn.disabled = true;

            try {
                // 2. Start the Render
                const response = await fetch(`${BACKEND_URL}/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ script, format })
                });

                const data = await response.json();
                
                if (data.job_id) {
                    statusText.innerText = "⚙️ The Swarm is rendering...";
                    // 3. Start checking the status every 3 seconds
                    checkStatus(data.job_id);
                }
            } catch (error) {
                statusText.innerText = "❌ Connection Error. Is Railway awake?";
                generateBtn.disabled = false;
                console.error("Error:", error);
            }
        });
    }

    async function checkStatus(jobId) {
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/status/${jobId}`);
                const data = await res.json();

                statusText.innerText = "📊 Status: " + data.status;

                if (data.status === "Completed") {
                    clearInterval(interval);
                    statusText.innerText = "✅ Video Ready! (Download Link coming soon)";
                    generateBtn.disabled = false;
                }
            } catch (err) {
                console.log("Polling error:", err);
            }
        }, 3000); 
    }
});
