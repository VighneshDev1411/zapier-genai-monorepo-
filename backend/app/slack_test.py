import os
import requests
from dotenv import load_dotenv

load_dotenv()  # Load .env variables

def send_message(text):
    token = os.getenv("SLACK_BOT_TOKEN")
    channel = os.getenv("SLACK_CHANNEL_ID")

    url = "https://slack.com/api/chat.postMessage"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    data = {
        "channel": channel,
        "text": text
    }

    res = requests.post(url, headers=headers, json=data)
    print(res.json())

send_message("🚀 Hello from my Slack bot! How are you ? ")
