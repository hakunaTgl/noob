const components = [
    {
        title: "🌤 Weather API",
        description: "Fetch city-level conditions via OpenWeatherMap.",
        snippet: "from components.weather import get_weather\nprint(get_weather('Lisbon'))"
    },
    {
        title: "📲 Telegram Bot",
        description: "Send proactive updates to a chat.",
        snippet: "from components.telegram import send_message\nsend_message('123456', 'Hello from Ultra MAXX')"
    },
    {
        title: "🧠 Sentiment AI",
        description: "Run local ML inference through the Flask backend.",
        snippet: "import requests\ntext = 'Ultra MAXX feels fast today'\nres = requests.post('http://localhost:5000/predict_sentiment', json={'text': text})\nprint(res.json())"
    }
];

function updateLog(message) {
    const log = document.getElementById("log");
    const li = document.createElement("li");
    const time = new Date().toLocaleTimeString();
    li.innerText = `[${time}] ${message}`;
    log.prepend(li);
}

function renderComponents() {
    const list = document.getElementById("component-library");
    components.forEach(component => {
        const card = document.createElement("article");
        card.className = "component-card";

        const title = document.createElement("h3");
        title.textContent = component.title;

        const description = document.createElement("p");
        description.textContent = component.description;

        const button = document.createElement("button");
        button.textContent = "Insert snippet";
        button.addEventListener("click", () => {
            document.getElementById("editor").value = component.snippet;
            updateLog(`📦 Added ${component.title} snippet to editor`);
        });

        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(button);
        list.appendChild(card);
    });
}

function configureSkulpt() {
    Sk.configure({
        output: x => document.getElementById("output").innerText += x + '\n',
        read: builtinRead
    });
}

function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
        throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}

function runCode() {
    const prog = document.getElementById("editor").value;
    const outputElement = document.getElementById("output");
    const perfElement = document.getElementById("perf");
    outputElement.innerText = "";
    configureSkulpt();

    const start = performance.now();
    Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, prog))
        .then(() => {
            const elapsed = performance.now() - start;
            perfElement.innerText = `Last run: ${elapsed.toFixed(1)} ms`;
            updateLog("▶️ Ran code in browser");
        })
        .catch(error => {
            outputElement.innerText = error.toString();
            perfElement.innerText = "Last run failed";
            updateLog("⚠️ Skulpt execution error");
        });
}

function startVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const status = document.getElementById("voice-status");
    if (!SpeechRecognition) {
        status.innerText = "Speech recognition not supported in this browser.";
        updateLog("❌ Speech recognition unsupported");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = function() {
        status.innerText = "Listening...";
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById("transcription").innerText = transcript;
        const prompt = `# Bot idea: ${transcript}\nprint("Generated bot for: ${transcript}")`;
        document.getElementById("editor").value = prompt;
        status.innerText = "Captured voice input";
        updateLog("🎙 Received: " + transcript);
    };

    recognition.onerror = function(event) {
        status.innerText = "Voice recognition error: " + event.error;
        updateLog("❗ Voice recognition error");
    };

    recognition.onend = function() {
        status.innerText = "Ready";
    };

    recognition.start();
}

function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
        document.getElementById("sw-status").innerText = 'Service workers not supported';
        updateLog('⚠️ Service workers unsupported in this browser');
        return;
    }

    navigator.serviceWorker.register('/service-worker.js')
        .then(() => {
            document.getElementById("sw-status").innerText = 'Cached for offline use';
            updateLog('✅ Service worker active');
        })
        .catch(() => {
            document.getElementById("sw-status").innerText = 'Failed to cache assets';
            updateLog('❌ Service worker registration failed');
        });
}

document.addEventListener("DOMContentLoaded", () => {
    renderComponents();
    document.getElementById("mic-btn").addEventListener("click", startVoiceRecognition);
    document.getElementById("run-btn").addEventListener("click", runCode);
    registerServiceWorker();
});
