import requests

def send_message(chat_id, message):
    token = "YOUR_BOT_TOKEN"
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    requests.post(url, data={"chat_id": chat_id, "text": message})
