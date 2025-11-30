from datetime import datetime
from components.weather import get_weather
from components.telegram import send_message


def weather_alert(city, chat_id, threshold=30):
    """Send a Telegram alert when temperature meets a threshold."""
    temp = get_weather(city)
    timestamp = datetime.utcnow().isoformat() + "Z"
    message = f"{city} is {temp}°C at {timestamp}"
    if temp >= threshold:
        message += f" 🔥 Above {threshold}°C threshold"
    else:
        message += f" ❄️ Below {threshold}°C threshold"

    send_message(chat_id, message)
    return {
        "city": city,
        "temperature": temp,
        "threshold": threshold,
        "sent_at": timestamp,
        "chat_id": chat_id
    }


def compose_status_report(city, chat_id, threshold=30):
    """Build a structured report without dispatching it."""
    snapshot = weather_alert(city, chat_id, threshold)
    snapshot["dispatched"] = True
    snapshot["summary"] = f"{city} @ {snapshot['temperature']}°C (limit {threshold})"
    return snapshot
