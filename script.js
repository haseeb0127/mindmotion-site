// 1. PASTE YOUR RAILWAY URL HERE
const BACKEND_URL = "https://your-generated-name.up.railway.app"; 

const generateBtn = document.querySelector('#generate-btn');
const scriptInput = document.querySelector('#script-input');
const statusText = document.querySelector('#status-display');
const formatSelector = document.querySelector('#format-selector');

generateBtn.addEventListener('click', async () => {
    const script = scriptInput.value;
    const format = formatSelector.value;

    if (!script) {
        alert("Please enter a script first!");
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
            statusText.innerText = "⚙️ The Swarm is rendering your video...";
            checkStatus(data.job_id);
        }

    } catch (error) {
        statusText.innerText = "❌ Error: Could not connect to engine.";
        generateBtn.disabled = false;
        console.error(error);
    }
});

async function checkStatus(jobId) {
    const interval = setInterval(async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/status/${jobId}`);
            const data = await res.json();

            statusText.innerText = "📊 Status: " + data.status;

            if (data.status === "Completed") {
                clearInterval(interval);
                statusText.innerText = "✅ Video Ready! (Download link coming soon)";
                generateBtn.disabled = false;
            }
        } catch (err) {
            console.log("Polling error:", err);
        }
    }, 3000); // Checks every 3 seconds
}
