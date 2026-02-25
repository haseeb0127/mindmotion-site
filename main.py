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
                alert("Please enter a script first!");
                return;
            }

            // 1. Initial UI feedback
            statusText.innerText = "🚀 Sending to MindMotion Swarm...";
            generateBtn.disabled = true;

            try {
                // 2. Trigger the Backend
                const response = await fetch(`${BACKEND_URL}/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ script, format })
                });

                const data = await response.json();
                
                // 3. Update the UI based on your FastAPI return message
                if (data.status === "Processing Started") {
                    statusText.innerText = "⚙️ " + data.message;
                    
                    // Note: In a real production app, we would now start 
                    // checking a /status endpoint to see when it's done.
                    simulateProgress(statusText);
                }
            } catch (error) {
                statusText.innerText = "❌ Connection Error. Is Railway awake?";
                generateBtn.disabled = false;
            }
        });
    }

    function simulateProgress(element) {
        let seconds = 0;
        const interval = setInterval(() => {
            seconds += 2;
            element.innerText = `⚡ Swarm is rendering... (${seconds}s elapsed)`;
            if (seconds >= 10) { 
                clearInterval(interval);
                element.innerHTML = `✅ Video Ready! <br><br> <a href="#" class="download-btn">📥 Download MP4</a>`;
            }
        }, 2000);
    }
});
