from langchain.tools import tool
import os
import requests

SLACK_TOKEN = os.getenv("SLACK_BOT_TOKEN")
SLACK_CHANNEL_ID = os.getenv("SLACK_CHANNEL_ID")

@tool
def post_to_slack(message: str) -> str:
    """Posts a message to a Slack channel."""
    headers = {
        "Authorization": f"Bearer {SLACK_TOKEN}",
        "Content-Type": "application/json"
    }
    data = {
        "channel": SLACK_CHANNEL_ID,
        "text": message
    }

    res = requests.post("https://slack.com/api/chat.postMessage", headers=headers, json=data)
    if res.status_code == 200 and res.json().get("ok"):
        return "✅ Slack message sent."
    else:
        return f"❌ Slack error: {res.text}"
