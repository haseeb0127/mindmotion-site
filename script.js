generateBtn.addEventListener('click', async () => {
    const text = scriptInput.value.trim();
    const imageFile = document.getElementById('char-image').files[0];

    if (!text) return alert("Please enter reasoning input first!");

    // 1. Setup UI
    generateBtn.disabled = true;
    progressContainer.style.display = 'block';
    consoleBox.innerHTML = "> [Nano Banana] Initiating Multipart Handshake...";

    // 2. Prepare FormData (Crucial for Images)
    const formData = new FormData();
    formData.append('script', text);
    formData.append('format', "16:9");
    if (imageFile) {
        formData.append('reference_image', imageFile);
        consoleBox.innerHTML += `<br>> Character Consistency Locked.`;
    }

    try {
        // 3. The Fetch (No Headers needed!)
        const response = await fetch(`${BASE_URL}/generate`, {
            method: 'POST',
            body: formData // Browser sets Content-Type automatically here
        });

        if (!response.ok) throw new Error("Connection Refused by Railway");
        
        const { job_id } = await response.json();
        consoleBox.innerHTML += `<br>> Job ID Received: ${job_id}`;
        
        // ... (rest of your polling logic remains the same)
        
    } catch (error) {
        consoleBox.innerHTML += `<br><span style="color:red">> Error: ${error.message}</span>`;
        generateBtn.disabled = false;
    }
});
