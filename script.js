const BACKEND_URL = "https://mindmotion-site-production.up.railway.app";

document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.querySelector('#generate-btn');
    const statusText = document.querySelector('#status-display');
    const scriptInput = document.querySelector('#script-input');

    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const script = scriptInput.value;
            const format = "16:9"; // You can link this to a dropdown later

            if (!script) {
                alert("Asif, please enter a script first!");
                return;
            }

            statusText.innerText = "🚀 Sending to MindMotion Engine...";
            generateBtn.disabled = true;

            try {
                const response = await fetch(`${BACKEND_URL}/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ script, format })
                });

                const data = await response.json();
                
                if (data.job_id) {
                    statusText.innerText = "⚙️ The Swarm is rendering...";
                    checkStatus(data.job_id);
                }
            } catch (error) {
                statusText.innerText = "❌ Connection Error. Is Railway awake?";
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

                if (data.status === "Completed") {
                    clearInterval(interval);
                    statusText.innerHTML = `
                        <div style="margin-top: 20px;">
                            <p>✅ Video Ready!</p>
                            <a href="#" id="download-link" class="download-button" style="padding: 10px 20px; background: #008080; color: white; text-decoration: none; border-radius: 5px;">
                                📥 Download Branded Video
                            </a>
                        </div>
                    `;
                    generateBtn.disabled = false;
                    
                    // Add an alert for the user
                    alert("Your MindMotion video is ready for social media!");
                }
            } catch (err) {
                console.log("Polling error:", err);
            }
        }, 3000); // Checks every 3 seconds
    }
});
