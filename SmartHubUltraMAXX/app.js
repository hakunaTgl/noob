const BACKEND_URL = 'http://localhost:5000';

const components = [
    {
        title: "🌤 Weather API",
        description: "Fetch city-level conditions via OpenWeatherMap.",
        snippet: "from components.weather import get_weather\nprint(get_weather('Lisbon'))",
        tags: ["data", "http"]
    },
    {
        title: "📲 Telegram Bot",
        description: "Send proactive updates to a chat.",
        snippet: "from components.telegram import send_message\nsend_message('123456', 'Hello from Ultra MAXX')",
        tags: ["messaging", "alerts"]
    },
    {
        title: "🧠 Sentiment AI",
        description: "Run local ML inference through the Flask backend.",
        snippet: "import requests\ntext = 'Ultra MAXX feels fast today'\nres = requests.post(f'{BACKEND_URL}/predict_sentiment', json={'text': text})\nprint(res.json())",
        tags: ["ml", "nlp"]
    },
    {
        title: "🛰 Webhook Relay",
        description: "Listen for inbound events and forward them to bots.",
        snippet: "import http.server, socketserver\nPORT = 8081\nclass Handler(http.server.SimpleHTTPRequestHandler):\n    def do_POST(self):\n        length = int(self.headers['Content-Length'])\n        print('Webhook payload:', self.rfile.read(length))\nwith socketserver.TCPServer(('', PORT), Handler) as httpd:\n    print('listening on', PORT)\n    httpd.serve_forever()",
        tags: ["events", "server"]
    },
    {
        title: "🗂 File Drop Capture",
        description: "Capture uploads and parse metadata for downstream tools.",
        snippet: "import os, json\nfrom datetime import datetime\nfiles = os.listdir('.')\nprint(json.dumps({'timestamp': datetime.utcnow().isoformat(), 'files': files}, indent=2))",
        tags: ["io", "ops"]
    }
];

const quickTemplates = [
    {
        title: "Sentiment Router",
        summary: "Route text to backend sentiment and fan out alerts.",
        code: `import requests\nmessages = ["Ship it", "This is too slow"]\nfor msg in messages:\n    res = requests.post(f"${BACKEND_URL}/predict_sentiment", json={'text': msg}).json()\n    print(msg, '=>', res['sentiment'])`
    },
    {
        title: "Voice Note Summarizer",
        summary: "Stub pipeline to capture voice text and produce a digest.",
        code: `voice_text = "Draft sales follow up for ACME"\nprint('Captured voice note:', voice_text)\nprint('Summary:', voice_text[:50] + '...')`
    },
    {
        title: "Weather-to-Message Bot",
        summary: "Checks weather and crafts a chat-ready string.",
        code: `from components.weather import get_weather\nfrom components.telegram import send_message\ncity = 'Lisbon'\ntemp = get_weather(city)\nmessage = f"Heads up! {city} is {temp}°C"\nprint('Preview:', message)`
    }
];

const backendAssistants = [
    {
        title: "Health Probe",
        description: "Pulls backend readiness, endpoints, and model load status.",
        path: `${BACKEND_URL}/health`,
        method: 'GET',
        snippet: "import requests\nprint(requests.get('http://localhost:5000/health').json())"
    },
    {
        title: "Blueprint Generator",
        description: "Turn an idea into a structured build plan and components list.",
        path: `${BACKEND_URL}/blueprint`,
        method: 'POST',
        snippet: "import requests\nidea = 'Alert me when Lisbon weather spikes'\nprint(requests.post('http://localhost:5000/blueprint', json={'idea': idea}).json())"
    }
];

const runTelemetry = {
    success: 0,
    failures: 0,
    durations: []
};

function updateLog(message) {
    const log = document.getElementById("log");
    const li = document.createElement("li");
    const time = new Date().toLocaleTimeString();
    li.innerText = `[${time}] ${message}`;
    log.prepend(li);
}

function renderComponents(filter = "") {
    const list = document.getElementById("component-library");
    list.innerHTML = "";
    const query = filter.toLowerCase();

    components
        .filter(component => {
            if (!query) return true;
            return (
                component.title.toLowerCase().includes(query) ||
                component.description.toLowerCase().includes(query) ||
                (component.tags && component.tags.some(tag => tag.toLowerCase().includes(query)))
            );
        })
        .forEach(component => {
            const card = document.createElement("article");
            card.className = "component-card";

            const title = document.createElement("h3");
            title.textContent = component.title;

            const description = document.createElement("p");
            description.textContent = component.description;

            const tags = document.createElement("div");
            tags.className = "pill-row";
            (component.tags || []).forEach(tag => {
                const pill = document.createElement("span");
                pill.className = "pill";
                pill.textContent = tag;
                tags.appendChild(pill);
            });

            const button = document.createElement("button");
            button.textContent = "Insert snippet";
            button.addEventListener("click", () => {
                document.getElementById("editor").value = component.snippet;
                updateLog(`📦 Added ${component.title} snippet to editor`);
            });

            card.appendChild(title);
            card.appendChild(description);
            card.appendChild(tags);
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

function updateTelemetry() {
    const avg = runTelemetry.durations.length
        ? runTelemetry.durations.reduce((a, b) => a + b, 0) / runTelemetry.durations.length
        : 0;
    const last = runTelemetry.durations[runTelemetry.durations.length - 1];

    document.getElementById("run-count").innerText = runTelemetry.success;
    document.getElementById("fail-count").innerText = runTelemetry.failures;
    document.getElementById("avg-run").innerText = runTelemetry.durations.length ? `${avg.toFixed(1)} ms` : "—";
    document.getElementById("last-run").innerText = last ? `${last.toFixed(1)} ms` : "—";
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
            runTelemetry.success += 1;
            runTelemetry.durations.push(elapsed);
            updateTelemetry();
            updateLog(`▶️ Ran code in browser (${elapsed.toFixed(1)} ms)`);
        })
        .catch(error => {
            outputElement.innerText = error.toString();
            perfElement.innerText = "Last run failed";
            runTelemetry.failures += 1;
            updateTelemetry();
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
        document.getElementById("blueprint-idea").value = transcript;
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
    if (!("serviceWorker" in navigator)) {
        document.getElementById("sw-status").innerText = 'Service workers not supported';
        setHealthStatus('health-sw', 'Offline caching unavailable', false);
        updateLog('⚠️ Service workers unsupported in this browser');
        return;
    }

    navigator.serviceWorker.register('/service-worker.js')
        .then(() => {
            document.getElementById("sw-status").innerText = 'Cached for offline use';
            setHealthStatus('health-sw', 'Service worker ready', true);
            updateLog('✅ Service worker active');
        })
        .catch(() => {
            document.getElementById("sw-status").innerText = 'Failed to cache assets';
            setHealthStatus('health-sw', 'Service worker failed', false);
            updateLog('❌ Service worker registration failed');
        });
}

function renderQuickTemplates() {
    const container = document.getElementById("template-list");
    container.innerHTML = "";
    quickTemplates.forEach(template => {
        const card = document.createElement("article");
        card.className = "component-card";

        const title = document.createElement("h3");
        title.textContent = template.title;

        const summary = document.createElement("p");
        summary.textContent = template.summary;

        const button = document.createElement("button");
        button.textContent = "Load template";
        button.addEventListener("click", () => {
            document.getElementById("editor").value = template.code;
            updateLog(`⚡ Loaded ${template.title}`);
        });

        card.appendChild(title);
        card.appendChild(summary);
        card.appendChild(button);
        container.appendChild(card);
    });
}

function renderBackendAssistants() {
    const container = document.getElementById("backend-assistants");
    container.innerHTML = "";
    backendAssistants.forEach(assistant => {
        const card = document.createElement("article");
        card.className = "component-card";

        const title = document.createElement("h3");
        title.textContent = assistant.title;

        const description = document.createElement("p");
        description.textContent = assistant.description;

        const meta = document.createElement("p");
        meta.className = "status";
        meta.textContent = `${assistant.method} ${assistant.path}`;

        const button = document.createElement("button");
        button.textContent = "Copy fetch snippet";
        button.addEventListener("click", () => {
            document.getElementById("editor").value = assistant.snippet;
            updateLog(`🛰 Added ${assistant.title} call to editor`);
        });

        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(meta);
        card.appendChild(button);
        container.appendChild(card);
    });
}

function setHealthStatus(id, message, ok) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerText = message;
    el.dataset.ok = ok;
}

async function checkBackendHealth() {
    const statusTarget = document.getElementById('health-backend');
    if (!statusTarget) return;

    statusTarget.innerText = 'Pinging backend...';
    try {
        const res = await fetch(`${BACKEND_URL}/health`);
        const json = await res.json();
        setHealthStatus('health-backend', `Backend: ${json.status} | endpoints: ${json.endpoints.join(', ')}`, true);
        updateLog('🩺 Backend responded to health probe');
    } catch (err) {
        setHealthStatus('health-backend', 'Backend unreachable', false);
        updateLog('❌ Backend health probe failed');
    }
}

async function generateBlueprint() {
    const ideaInput = document.getElementById('blueprint-idea');
    const output = document.getElementById('blueprint-output');
    const idea = ideaInput.value.trim() || document.getElementById('transcription').innerText;

    output.innerText = 'Generating blueprint...';
    try {
        const res = await fetch(`${BACKEND_URL}/blueprint`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idea })
        });
        const data = await res.json();
        const steps = data.steps.map(step => `<li>${step}</li>`).join('');
        const comps = data.recommended_components.map(c => `<span class="pill">${c}</span>`).join(' ');
        output.innerHTML = `
            <p><strong>Idea:</strong> ${data.idea}</p>
            <p><strong>Delivery:</strong> ${data.delivery}</p>
            <div class="pill-row">${comps}</div>
            <ol>${steps}</ol>
        `;
        updateLog('🧭 Blueprint generated from backend');
    } catch (err) {
        output.innerText = 'Blueprint generation failed';
        updateLog('❌ Blueprint request failed');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderComponents();
    renderQuickTemplates();
    renderBackendAssistants();
    document.getElementById("mic-btn").addEventListener("click", startVoiceRecognition);
    document.getElementById("run-btn").addEventListener("click", runCode);
    document.getElementById("component-search").addEventListener("input", (e) => renderComponents(e.target.value));
    document.getElementById("blueprint-btn").addEventListener("click", generateBlueprint);
    registerServiceWorker();
    checkBackendHealth();
    updateTelemetry();
});
