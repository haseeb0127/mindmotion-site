// Replace with your actual Railway URL
const BACKEND_URL = "https://your-project-name.up.railway.app";

document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.querySelector('#generate-btn');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const script = document.querySelector('#script-input').value;
            const format = "16:9"; // Placeholder

            const response = await fetch(`${BACKEND_URL}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ script, format })
            });
            const data = await response.json();
            document.querySelector('#status-display').innerText = "Job ID: " + data.job_id;
        });
    }
});
