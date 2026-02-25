/* GLOBAL STYLES */
body {
    font-family: 'Inter', sans-serif;
    background-color: #f0f2f5;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
}

.container {
    background: #ffffff;
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    width: 95%;
    max-width: 650px;
    text-align: center;
}

h1 { color: #008080; margin-bottom: 5px; }

/* INPUTS & CONTROLS */
textarea {
    width: 100%;
    height: 120px;
    padding: 15px;
    border: 2px solid #ddd;
    border-radius: 12px;
    resize: none;
    box-sizing: border-box;
    margin-bottom: 15px;
    font-size: 14px;
}

textarea:focus { border-color: #008080; outline: none; }

.controls { display: flex; gap: 10px; margin-bottom: 20px; }

#generate-btn {
    background: #008080;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    flex-grow: 1;
    font-weight: bold;
    transition: 0.3s;
}

#generate-btn:hover { background: #005a5a; }

/* PROGRESS & PREVIEW */
#progress-container {
    height: 10px;
    background: #eee;
    border-radius: 5px;
    margin: 20px 0;
    overflow: hidden;
}

#progress-bar {
    height: 100%;
    background: #008080;
    width: 0%;
    transition: width 0.4s ease;
}

#preview-player {
    width: 100%;
    border-radius: 12px;
    border: 3px solid #008080;
    background: #000;
}

/* SHARE BUTTONS */
.share-buttons { display: flex; justify-content: center; gap: 10px; margin-top: 10px; }

.share-buttons a, #copy-link-btn {
    text-decoration: none;
    padding: 8px 15px;
    border-radius: 5px;
    font-size: 12px;
    font-weight: bold;
    color: white;
    border: none;
    cursor: pointer;
    transition: transform 0.2s;
}

#share-whatsapp { background: #25D366; }
#share-twitter { background: #1DA1F2; }
#copy-link-btn { background: #6c757d; }

#copy-link-btn:active { transform: scale(0.95); }

/* CONSOLE */
#engine-console {
    background: #1a1a1a;
    color: #00ff00;
    padding: 15px;
    font-family: monospace;
    height: 100px;
    overflow-y: auto;
    border-radius: 8px;
    margin-top: 25px;
    text-align: left;
    font-size: 11px;
    border-left: 5px solid #008080;
}

/* HISTORY SECTION */
#history-container {
    margin-top: 30px;
    border-top: 2px solid #eee;
    padding-top: 20px;
    text-align: left;
}

.history-header { display: flex; justify-content: space-between; align-items: center; }

.history-actions button {
    background: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 10px;
    padding: 3px 7px;
}

#export-history { border: 1px solid #008080; color: #008080; margin-right: 5px; }
#export-history:hover { background: #008080; color: white; }

#clear-history { border: 1px solid #ff4d4d; color: #ff4d4d; }
#clear-history:hover { background: #ff4d4d; color: white; }

#history-list { list-style: none; padding: 0; margin-top: 15px; }

#history-list li {
    background: #f8f9fa;
    padding: 10px;
    border-radius: 6px;
    margin-bottom: 8px;
    border-left: 4px solid #008080;
}

#history-list a { color: #008080; text-decoration: none; font-weight: bold; font-size: 12px; }
#history-list a:hover { text-decoration: underline; }
