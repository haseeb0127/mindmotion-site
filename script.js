:root {
    --primary: #008080;
    --primary-light: #00d4ff;
    --dark-bg: #0f172a;
    --card-bg: #f0fdfd;
    --text-main: #334155;
    --console-bg: #1a1a1a;
}

body {
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background-color: var(--dark-bg);
    color: white;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

/* Feature Card */
.tools-grid {
    width: 100%;
    max-width: 800px;
    margin-bottom: 20px;
}

.card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 20px;
    border-radius: 15px;
    transition: 0.3s ease;
    text-align: center;
}

.card:hover {
    transform: translateY(-5px);
    border-color: var(--primary);
}

/* Main Container */
.container {
    background: white;
    color: var(--text-main);
    width: 100%;
    max-width: 600px;
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    text-align: center;
}

h1 { margin-bottom: 5px; color: var(--dark-bg); }
.accent { color: var(--primary); }
.subtitle { font-size: 0.9rem; color: #64748b; margin-bottom: 20px; }

/* Input Fields */
textarea {
    width: 100%;
    height: 120px;
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    margin-bottom: 15px;
    font-family: inherit;
    box-sizing: border-box;
    resize: none;
}

.controls {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

select, #generate-btn {
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}

#format-selector { flex: 1; }
#generate-btn {
    flex: 2;
    background: var(--primary);
    color: white;
    border: none;
    font-weight: bold;
    cursor: pointer;
    transition: 0.2s;
}

#generate-btn:hover { background: #006666; }
#generate-btn:disabled { background: #94a3b8; cursor: not-allowed; }

/* Pro Settings */
.pro-settings {
    border: 2px solid var(--primary);
    padding: 15px;
    border-radius: 12px;
    margin-bottom: 20px;
    background: var(--card-bg);
    text-align: left;
}

.pro-settings h5 { color: var(--primary); margin: 0 0 10px 0; }
.pro-settings label { font-size: 11px; font-weight: bold; display: block; margin-bottom: 5px; }

.btn-group { display: flex; gap: 10px; }
.secondary-btn {
    flex: 1; font-size: 11px; padding: 8px; border-radius: 5px;
    border: none; background: #34495e; color: white; cursor: pointer;
}

/* Progress Bar */
#progress-container {
    display: none; height: 10px; background: #eee;
    border-radius: 5px; margin: 20px 0; overflow: hidden;
}

#progress-bar {
    height: 100%; background: var(--primary);
    width: 0%; transition: width 0.4s ease;
}

/* Video Preview */
#video-preview-box { display: none; margin-bottom: 20px; }
#preview-player {
    width: 100%; border-radius: 12px;
    border: 3px solid var(--primary); background: #000;
}

/* Console */
#engine-console {
    background: var(--console-bg); color: #00ff00;
    padding: 15px; font-family: monospace; height: 100px;
    overflow-y: auto; border-radius: 8px; margin-top: 25px;
    text-align: left; font-size: 11px; border-left: 5px solid var(--primary);
}

/* History */
#history-container { margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; text-align: left; }
.history-header { display: flex; justify-content: space-between; align-items: center; }
#history-list { list-style: none; padding: 0; margin-top: 10px; }
#history-list li { padding: 8px; border-bottom: 1px solid #f1f5f9; font-size: 12px; display: flex; justify-content: space-between; }

/* Share Hub */
#share-hub { display: none; padding-top: 15px; border-top: 1px solid #eee; }
.share-buttons { display: flex; gap: 10px; justify-content: center; margin-top: 10px; }
.share-btn { padding: 8px 12px; border-radius: 5px; text-decoration: none; font-size: 11px; color: white; font-weight: bold; }
.wa { background: #25D366; }
.x { background: #000; }
.copy { background: #64748b; border: none; cursor: pointer; }
