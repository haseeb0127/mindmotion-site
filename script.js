const BACKEND_URL = "https://mindmotion-site-production.up.railway.app";

async function startRender() {
    const script = document.getElementById('script-input').value;
    const statusBox = document.getElementById('status-display');

    if (!script) { alert("Please enter a script!"); return; }

    statusBox.innerText = "🚀 Sending to Swarm...";

    try {
        const res = await fetch(`${BACKEND_URL}/generate`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ script: script, format: "16:9" })
        });
        const data = await res.json();
        checkStatus(data.job_id);
    } catch (err) {
        statusBox.innerText = "❌ Connection Error!";
    }
}

function checkStatus(jobId) {
    const statusBox = document.getElementById('status-display');
    const interval = setInterval(async () => {
        const res = await fetch(`${BACKEND_URL}/status/${jobId}`);
        const data = await res.json();
        statusBox.innerText = "📊 Status: " + data.status;

        if (data.status === "Completed") {
            clearInterval(interval);
            statusBox.innerHTML = "✅ Video Ready! <button onclick='alert(\"Download Started\")'>Download Video</button>";
        }
    }, 2000);
}
