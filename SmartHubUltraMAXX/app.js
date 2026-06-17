const components = [
    {
        title: "🌤 Weather API",
        description: "Fetch city-level conditions via OpenWeatherMap.",
        tags: ["requests", "json"],
        snippet: "from components.weather import get_weather\nprint(get_weather('Lisbon'))"
    },
    {
        title: "📲 Telegram Bot",
        description: "Send proactive updates to a chat.",
        tags: ["messaging", "alerts"],
        snippet: "from components.telegram import send_message\nsend_message('123456', 'Hello from Ultra MAXX')"
    },
    {
        title: "🧠 Sentiment AI",
        description: "Run local ML inference through the Flask backend.",
        tags: ["ml", "flask"],
        snippet: "import requests\ntext = 'Ultra MAXX feels fast today'\nres = requests.post('http://localhost:5000/predict_sentiment', json={'text': text})\nprint(res.json())"
    },
    {
        title: "⏱ Uptime Probe",
        description: "Check a health endpoint and emit a log entry.",
        tags: ["ops", "monitoring"],
        snippet: "import requests\nresp = requests.get('https://httpbin.org/status/200')\nprint('Uptime check:', resp.status_code)"
    },
    {
        title: "📦 Webhook Trigger",
        description: "Fire-and-forget event with retry-friendly payloads.",
        tags: ["hooks", "json"],
        snippet: "import requests\npayload = {'event': 'order.created', 'id': 'abc-123'}\nrequests.post('https://httpbin.org/post', json=payload)"
    }
];

const templates = [
    {
        title: "Sentiment bot",
        subtitle: "Voice → sentiment → notify",
        snippet: "import requests\ntext = 'Ship the Ultra MAXX release'\nres = requests.post('http://localhost:5000/predict_sentiment', json={'text': text})\nprint('Sentiment score:', res.json())"
    },
    {
        title: "Webhook echo",
        subtitle: "Emit webhooks with retries",
        snippet: "import requests, json, time\npayload = {'event': 'demo', 'ts': time.time()}\nprint('Sending webhook...')\nresp = requests.post('https://httpbin.org/post', json=payload)\nprint('Status:', resp.status_code)\nprint('Echo:', resp.json()['json'])"
    },
    {
        title: "Weather notifier",
        subtitle: "Fetch weather and format alerts",
        snippet: "import requests\ncity = 'Lisbon'\nprint('Fetching weather for', city)\nresp = requests.get(f'https://wttr.in/{city}?format=j1')\ndata = resp.json()\ncurrent = data['current_condition'][0]\nprint('Temp:', current['temp_C'], '°C')\nprint('Feels like:', current['FeelsLikeC'], '°C')"
    }
];

let runCount = 0;
let timelineEvents = [];

function updateLog(message) {
    const log = document.getElementById("log");
    const li = document.createElement("li");
    const time = new Date().toLocaleTimeString();
    li.innerText = `[${time}] ${message}`;
    log.prepend(li);
}

function updateTimeline(event, status = "On") {
    timelineEvents = [{ event, status, time: new Date().toLocaleTimeString() }, ...timelineEvents].slice(0, 4);
    const timeline = document.getElementById("timeline");
    timeline.innerHTML = "";
    timelineEvents.forEach(item => {
        const row = document.createElement("div");
        row.className = "event";
        row.innerHTML = `<span>${item.event}</span><strong>${item.status}</strong>`;
        timeline.appendChild(row);
    });
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

        const tags = document.createElement("div");
        tags.className = "tags";
        component.tags?.forEach(tag => {
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

        const copy = document.createElement("button");
        copy.textContent = "Copy";
        copy.className = "secondary";
        copy.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(component.snippet);
                updateLog(`✅ Copied ${component.title} snippet`);
            } catch (err) {
                updateLog("⚠️ Clipboard blocked");
            }
        });

        const actionRow = document.createElement("div");
        actionRow.className = "status-row";
        actionRow.appendChild(button);
        actionRow.appendChild(copy);

        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(tags);
        card.appendChild(actionRow);
        list.appendChild(card);
    });
}

function renderTemplates() {
    const list = document.getElementById("template-library");
    templates.forEach(template => {
        const card = document.createElement("article");
        card.className = "template-card";

        const info = document.createElement("div");
        info.className = "info";
        const title = document.createElement("span");
        title.className = "title";
        title.textContent = template.title;
        const subtitle = document.createElement("span");
        subtitle.className = "subtitle";
        subtitle.textContent = template.subtitle;
        info.appendChild(title);
        info.appendChild(subtitle);

        const useBtn = document.createElement("button");
        useBtn.textContent = "Load";
        useBtn.addEventListener("click", () => {
            document.getElementById("editor").value = template.snippet;
            updateLog(`⚡ Loaded template: ${template.title}`);
        });

        card.appendChild(info);
        card.appendChild(useBtn);
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
    const runLatency = document.getElementById("run-latency");
    const runCountEl = document.getElementById("run-count");
    const healthState = document.getElementById("health-state");
    outputElement.innerText = "";
    configureSkulpt();

    const start = performance.now();
    Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, prog))
        .then(() => {
            const elapsed = performance.now() - start;
            perfElement.innerText = `Last run: ${elapsed.toFixed(1)} ms`;
            runLatency.innerText = `${elapsed.toFixed(1)} ms`;
            runCount += 1;
            runCountEl.innerText = runCount;
            healthState.innerText = "Ready";
            healthState.className = "value success";
            updateLog("▶️ Ran code in browser");
            updateTimeline("Executed in-browser", "OK");
        })
        .catch(error => {
            outputElement.innerText = error.toString();
            perfElement.innerText = "Last run failed";
            runLatency.innerText = "Error";
            healthState.innerText = "Check code";
            healthState.className = "value warning";
            updateLog("⚠️ Skulpt execution error");
            updateTimeline("Runtime error", "Error");
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
        updateTimeline("Captured voice idea", "Ready");
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
            updateTimeline('Assets cached', 'OK');
        })
        .catch(() => {
            document.getElementById("sw-status").innerText = 'Failed to cache assets';
            updateLog('❌ Service worker registration failed');
            updateTimeline('Caching failed', 'Retry');
        });
}

function hydrateDemoLog() {
    [
        "✅ Bootstrapped Ultra MAXX shell",
        "🛰 Connected telemetry exporter",
        "🧪 Ready for voice capture"
    ].forEach(item => updateLog(item));
}

function downloadLog() {
    const logItems = Array.from(document.querySelectorAll('#log li')).map(li => li.innerText).join('\n');
    const blob = new Blob([logItems], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'smart-hub-log.txt';
    anchor.click();
    URL.revokeObjectURL(url);
    updateLog('⬇️ Downloaded log as text');
}

function setupEditorShortcuts() {
    document.getElementById('copy-btn').addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(document.getElementById('editor').value);
            updateLog('📋 Copied editor contents');
        } catch (err) {
            updateLog('⚠️ Clipboard blocked');
        }
    });

    document.getElementById('clear-editor').addEventListener('click', () => {
        document.getElementById('editor').value = '';
        document.getElementById('output').innerText = '';
        updateLog('🧹 Cleared editor');
    });

    document.getElementById('save-draft').addEventListener('click', () => {
        const code = document.getElementById('editor').value;
        localStorage.setItem('ultra-maxx-draft', code);
        updateLog('💾 Draft saved to local storage');
    });

    const stored = localStorage.getItem('ultra-maxx-draft');
    if (stored) {
        document.getElementById('editor').value = stored;
        updateLog('📂 Restored previous draft');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderComponents();
    renderTemplates();
    hydrateDemoLog();
    setupEditorShortcuts();
    document.getElementById("mic-btn").addEventListener("click", startVoiceRecognition);
    document.getElementById("run-btn").addEventListener("click", runCode);
    document.getElementById("download-log").addEventListener("click", downloadLog);
    registerServiceWorker();
    updateTimeline('UI Ready', 'Active');
});
