from langchain.tools import tool
from app.tools.gmail import send_email

@tool
def send_gmail(to: str, message: str) -> str:
    """Sends an email to the given recipient."""
    try:
        send_email(to=to, subject="GenAI Automation", body=message)
        return f"✅ Email sent to {to}"
    except Exception as e:
        return f"❌ Failed to send email: {str(e)}"
