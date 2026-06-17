from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)
model = joblib.load('sentiment_model.pkl')


@app.route('/predict_sentiment', methods=['POST'])
def predict_sentiment():
    text = request.json['text']
    prediction = model.predict([text])[0]
    return jsonify({'sentiment': prediction})


@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'model_loaded': model is not None,
        'endpoints': ['predict_sentiment', 'blueprint'],
    })


@app.route('/blueprint', methods=['POST'])
def blueprint():
    payload = request.json or {}
    idea = payload.get('idea', 'multi-modal assistant')
    normalized = idea.lower()

    components = []
    if 'weather' in normalized:
        components.append('Weather API')
    if 'notify' in normalized or 'alert' in normalized or 'telegram' in normalized:
        components.append('Messaging/Telegram')
    if 'sentiment' in normalized or 'review' in normalized:
        components.append('Sentiment AI')
    if 'voice' in normalized or 'speech' in normalized:
        components.append('Voice capture')

    steps = [
        'Capture user intent and normalize entities',
        'Map intent to available building blocks',
        'Generate runnable Python scaffold in-browser',
        'Route ML-heavy tasks to Flask backend endpoints',
        'Log telemetry and surface service health to operators'
    ]

    blueprint = {
        'idea': idea,
        'recommended_components': components or ['Core runtime'],
        'delivery': 'Offline-first shell with Skulpt runtime + Flask microservices',
        'steps': steps,
    }
    return jsonify(blueprint)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
