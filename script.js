// Replace this with your actual Railway URL if it changes
const BACKEND_URL = "https://mindmotion-site-production.up.railway.app";

document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.querySelector('#generate-btn');
    const statusText = document.querySelector('#status-display');
    const scriptInput = document.querySelector('#script-input');
    const progressBar = document.querySelector('#progress-bar');
    const progressContainer = document.querySelector('#progress-container');

    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const script = scriptInput.value;
            const format = document.querySelector('#format-selector').value;

            if (!script) {
                alert("Asif, please enter a script first!");
                return;
            }

            // 1. Initial UI Setup
            statusText.innerText = "🚀 Connecting to Swarm...";
            generateBtn.disabled = true;
            progressContainer.style.display = "block";
            progressBar.style.width = "5%";

            try {
                // 2. Send the "Generate" Command
                const response = await fetch(`${BACKEND_URL}/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ script, format })
                });

                const data = await response.json();
                
                if (data.job_id) {
                    // 3. Start watching the progress
                    pollStatus(data.job_id);
                }
            } catch (error) {
                statusText.innerText = "❌ Connection Error. Is the Railway Engine running?";
                generateBtn.disabled = false;
            }
        });
    }
function updateConsole(msg) {
    const consoleBox = document.querySelector('#engine-console');
    consoleBox.innerHTML += `> ${msg}<br>`;
    consoleBox.scrollTop = consoleBox.scrollHeight;
}
    async function pollStatus(jobId) {
        let progress = 10;

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/status/${jobId}`);
                const data = await res.json();

                // Logic to move the bar based on the backend status
                if (data.status.includes("Slicing")) {
                    progress = 25;
                } else if (data.status.includes("Rendering")) {
                    progress = 65;
                } else if (data.status.includes("Stitching")) {
                    progress = 90;
                } else if (data.status === "Completed") {
                    progress = 100;
                    clearInterval(interval);
                    
                    // Reveal Final Download Button
                    statusText.innerHTML = `
                        <div style="color: #008080; font-weight: bold; margin-top: 10px;">
                            ✅ Video Ready for Social Media! <br>
                            <a href="#" class="download-btn" style="display:inline-block; margin-top:10
