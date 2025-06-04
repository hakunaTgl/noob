from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)
model = joblib.load('sentiment_model.pkl')

@app.route('/predict_sentiment', methods=['POST'])
def predict_sentiment():
    text = request.json['text']
    prediction = model.predict([text])[0]
    return jsonify({'sentiment': prediction})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
