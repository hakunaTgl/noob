import joblib

model = joblib.load('sentiment_model.pkl')

def predict_sentiment(text):
    return model.predict([text])[0]
