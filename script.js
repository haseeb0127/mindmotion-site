const BACKEND_URL = "https://mindmotion-site-production.up.railway.app";

document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.querySelector('#generate-btn');
    const statusText = document.querySelector('#status-display');
    const scriptInput = document.querySelector('#script-input');

    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const script = scriptInput.value;
            const format = "16:9"; 

            if (!script) {
                alert("Asif, please enter a script first!");
                return;
            }

            // 1. Initial UI feedback
            statusText.innerText = "🚀 Sending to MindMotion Engine...";
            generateBtn.disabled = true;

            try {
                // 2. Trigger the Backend
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
                statusText.innerText = "❌ Connection Error. Check Railway Logs.";
                generateBtn.disabled = false;
            }
        });
    }

    async function checkStatus(jobId) {
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/status/${jobId}`);
                const data = await res.json();

                statusText.innerText = "📊 Status: " + data.status;

                // 4. When the Swarm finishes...
                if (data.status === "Completed") {
                    clearInterval(interval);
                    
                    // Reveal the Download Button
                    statusText.innerHTML = `
                        <div style="margin-top: 20px; border: 2px solid #008080; padding: 15px; border-radius: 8px;">
                            <p style="color: #008080; font-weight: bold;">✅ Video Ready for Social Media!</p>
                            <a href="#" class="download-btn" style="background: #008080; color: white; padding: 10px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
                                📥 Download Branded MP4
                            </a>
                        </div>
                    `;
                    generateBtn.disabled = false;
                    alert("Your MindMotion video is ready!");
                }
            } catch (err) {
                console.log("Polling error:", err);
            }
        }, 3000); 
    }
});
