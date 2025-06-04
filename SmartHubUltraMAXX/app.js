function updateLog(message) {
    const log = document.getElementById("log");
    const li = document.createElement("li");
    li.innerText = message;
    log.appendChild(li);
}

function runCode() {
    let prog = document.getElementById("editor").value;
    document.getElementById("output").innerText = "";
    Sk.configure({ output: x => document.getElementById("output").innerText += x + '\n' });
    Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, prog));
    updateLog("▶️ Ran code in browser");
}

function startVoiceRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById("transcription").innerText = transcript;
        const prompt = `# Bot idea: ${transcript}\nprint("Generated bot for: ${transcript}")`;
        document.getElementById("editor").value = prompt;
        updateLog("🎙 Received: " + transcript);
    };

    recognition.onerror = function(event) {
        alert("Voice recognition error: " + event.error);
    };

    recognition.start();
}

document.getElementById("mic-btn").addEventListener("click", startVoiceRecognition);
