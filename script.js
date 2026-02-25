const generateBtn = document.querySelector('#generate-btn'); // Matches your button ID
const scriptInput = document.querySelector('#script-input'); // Matches your textarea ID
const statusText = document.querySelector('#status-display'); // A place to show progress

generateBtn.addEventListener('click', async () => {
    const script = scriptInput.value;
    const format = document.querySelector('#format-selector').value;

    if (!script) {
        alert("Please enter a script first!");
        return;
    }

    // 1. Show the user we are starting
    statusText.innerText = "Sending to MindMotion Engine...";
    generateBtn.disabled = true;

    try {
        // 2. Send to our Railway Backend
        // REPLACE the URL below with your actual Railway URL once deployed
        const response = await fetch('https://your-railway-url.com/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ script, format })
        });

        const data = await response.json();
        
        // 3. Start checking the status
        checkStatus(data.job_id);

    } catch (error) {
        statusText.innerText = "Error connecting to engine.";
        generateBtn.disabled = false;
    }
});

async function checkStatus(jobId) {
    const interval = setInterval(async () => {
        const res = await fetch(`https://your-railway-url.com/status/${jobId}`);
        const data = await res.json();

        statusText.innerText = "Status: " + data.status;

        if (data.status === "Completed") {
            clearInterval(interval);
            statusText.innerText = "Video Ready! (Download Link logic goes here)";
            generateBtn.disabled = false;
        }
    }, 3000); // Check every 3 seconds
}
