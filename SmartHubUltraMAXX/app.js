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
    },
    {
        title: "⚡ Workflow Orchestrator",
        description: "Chain weather sensing with Telegram alerts via one helper.",
        snippet: "from components.workflow import weather_alert\nresult = weather_alert('Lisbon', chat_id='123456', threshold=28)\nprint(result)"
    }
];

const templates = [
    {
        title: "Morning Weather Brief",
        description: "Check the forecast and ship a short briefing to your Telegram chat.",
        code: `"""Daily weather briefing that pairs the weather module with Telegram."""
from components.weather import get_weather
from components.telegram import send_message

city = 'Lisbon'
temp = get_weather(city)
summary = f"{city} wake-up report: {temp}°C right now"
send_message('123456', summary)
print('✅ Brief sent')`
    },
    {
        title: "Sentiment Inbox Triage",
        description: "Score incoming text and route urgent negative items to alerts.",
        code: `"""Use the Flask ML backend to triage messages."""
import requests

messages = [
    'The latest deploy is broken',
    'Love the new Smart Hub UI',
    'Please fix the overnight sync job'
]

for msg in messages:
    res = requests.post('http://localhost:5000/predict_sentiment', json={'text': msg})
    sentiment = res.json().get('sentiment')
    if sentiment == 'negative':
        print('🚨 Escalate:', msg)
    else:
        print('✅ Safe:', msg)`
    },
    {
        title: "Runbook Telemetry Logger",
        description: "Time your automation, log the result, and append to a run history.",
        code: `"""Lightweight performance logger for any routine."""
import time
from components.workflow import weather_alert

start = time.time()
report = weather_alert('Lisbon', chat_id='123456', threshold=26)
duration = (time.time() - start) * 1000
print(f"⏱️ Completed in {duration:.1f} ms")
print('Report:', report)`
    }
];

const STORAGE_KEYS = {
    draft: 'ultraMaxxDraft'
};

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

function renderTemplates() {
    const list = document.getElementById("template-library");
    templates.forEach(template => {
        const card = document.createElement("article");
        card.className = "component-card";

        const title = document.createElement("h3");
        title.textContent = template.title;

        const description = document.createElement("p");
        description.textContent = template.description;

        const button = document.createElement("button");
        button.textContent = "Load playbook";
        button.addEventListener("click", () => {
            document.getElementById("editor").value = template.code;
            updateLog(`📘 Loaded playbook: ${template.title}`);
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

function persistDraft() {
    if (!window.localStorage) {
        updateLog("⚠️ Drafts unsupported in this browser");
        return;
    }

    const editorValue = document.getElementById("editor").value;
    const payload = {
        code: editorValue,
        timestamp: new Date().toISOString()
    };

    try {
        localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify(payload));
        document.getElementById("draft-status").innerText = `Draft saved at ${new Date(payload.timestamp).toLocaleTimeString()}`;
        updateLog("💾 Draft saved to local storage");
    } catch (error) {
        updateLog("❌ Failed to save draft");
    }
}

function loadDraft() {
    if (!window.localStorage) {
        updateLog("⚠️ Drafts unsupported in this browser");
        return;
    }

    const payload = localStorage.getItem(STORAGE_KEYS.draft);
    if (!payload) {
        updateLog("ℹ️ No saved draft found");
        return;
    }

    try {
        const data = JSON.parse(payload);
        document.getElementById("editor").value = data.code || "";
        document.getElementById("draft-status").innerText = `Draft loaded from ${new Date(data.timestamp).toLocaleTimeString()}`;
        updateLog("📂 Loaded draft from local storage");
    } catch (error) {
        updateLog("❌ Failed to load draft");
    }
}

function copyToClipboard() {
    const editorValue = document.getElementById("editor").value;
    if (!navigator.clipboard) {
        updateLog("⚠️ Clipboard API unavailable");
        return;
    }

    navigator.clipboard.writeText(editorValue)
        .then(() => updateLog("📋 Copied code to clipboard"))
        .catch(() => updateLog("❌ Failed to copy code"));
}

function clearOutput() {
    document.getElementById("output").innerText = "";
    document.getElementById("perf").innerText = "Ready";
    updateLog("🧹 Cleared output and perf stats");
}

function attachWorkspaceUtilities() {
    document.getElementById("save-btn").addEventListener("click", persistDraft);
    document.getElementById("load-btn").addEventListener("click", loadDraft);
    document.getElementById("copy-btn").addEventListener("click", copyToClipboard);
    document.getElementById("clear-btn").addEventListener("click", clearOutput);
}

function restoreDraftOnLoad() {
    if (!window.localStorage) return;
    const payload = localStorage.getItem(STORAGE_KEYS.draft);
    if (!payload) return;

    try {
        const data = JSON.parse(payload);
        document.getElementById("editor").value = data.code || "";
        document.getElementById("draft-status").innerText = `Restored draft from ${new Date(data.timestamp).toLocaleTimeString()}`;
        updateLog("♻️ Restored previous draft");
    } catch (error) {
        // fail silently
    }
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
    renderTemplates();
    restoreDraftOnLoad();
    document.getElementById("mic-btn").addEventListener("click", startVoiceRecognition);
    document.getElementById("run-btn").addEventListener("click", runCode);
    attachWorkspaceUtilities();
    registerServiceWorker();
});
