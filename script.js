const BACKEND_URL = "https://mindmotion-site-production.up.railway.app";

document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.querySelector('#generate-btn');
    const statusText = document.querySelector('#status-display');
    const scriptInput = document.querySelector('#script-input');
    const progressBar = document.querySelector('#progress-bar');
    const progressContainer = document.querySelector('#progress-container');

    // 1. CONSOLE UPDATER
    function updateConsole(msg) {
        const consoleBox = document.querySelector('#engine-console');
        if (consoleBox) {
            const time = new Date().toLocaleTimeString([], { hour12: false });
            consoleBox.innerHTML += `> [${time}] ${msg}<br>`;
            consoleBox.scrollTop = consoleBox.scrollHeight;
        }
    }

    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const script = scriptInput.value;
            const format = document.querySelector('#format-selector').value;

            if (!script) {
                alert("Asif, please enter a script first!");
                return;
            }

            // UI Reset
            statusText.innerText = "🚀 Connecting to Swarm...";
            updateConsole("Handshaking with Railway Cluster...");
            generateBtn.disabled = true;
            progressContainer.style.display = "block";
            progressBar.style.width = "5%";

            try {
                // 2. TRIGGER GENERATION
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
                statusText.innerText = "❌ Connection Error. Is Railway awake?";
                updateConsole("ERROR: Failed to reach the Swarm engine.");
                generateBtn.disabled = false;
            }
        });
    }

    // 3. STATUS POLLING
    async function pollStatus(jobId) {
        let progress = 10;
        let lastStatus = "";

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/status/${jobId}`);
                const data = await res.json();

                // Console logging for status changes
                if (data.status !== lastStatus) {
                    updateConsole(`System Update: ${data.status}`);
                    lastStatus = data.status;
                }

                // Bar movement logic
                if (data.status.includes("Slicing")) {
                    progress = 25;
                } else if (data.status.includes("Rendering")) {
                    progress = 65;
                } else if (data.status.includes("Stitching")) {
                    progress = 90;
                } else if (data.status === "Completed") {
                    progress = 100;
                    clearInterval(interval);
                    
                    // THE FINAL DOWNLOAD LINK
                    statusText.innerHTML = `
                        <div style="color: #008080; font-weight: bold; margin-top: 10px;">
                            ✅ Video Ready for Social Media! <br>
                            <a href="${BACKEND_URL}/download/${jobId}" class="download-btn" target="_blank" style="display:inline-block; margin-top:10px; background:#008080; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">
                                📥 Download Branded Video
                            </a>
                        </div>
                    `;
                    updateConsole("SUCCESS: All chunks merged and branded.");
                    generateBtn.disabled = false;
                }

                progressBar.style.width = progress + "%";
                if (data.status !== "Completed") {
                    statusText.innerText = "📊 " + data.status;
                }

            } catch (err) {
                console.log("Checking status...");
            }
        }, 2000); 
    }
});
