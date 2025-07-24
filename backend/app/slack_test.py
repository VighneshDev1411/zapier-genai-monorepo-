from app.core.tool_registry import TOOL_REGISTRY
import os
from dotenv import load_dotenv

load_dotenv()

# 🧠 Call Notion tool
notion_results = TOOL_REGISTRY["notion_query"].invoke("23a19a7b-6edc-8086-9b2b-efa943fc23f9")
print("[DEBUG] NOTION_API_KEY =", os.getenv("NOTION_API_KEY"))

# 🚨 Check for error
if isinstance(notion_results, str):
    print(f"❌ Notion Error: {notion_results}")
else:
    for result in notion_results.get("results", []):
        props = result["properties"]

        title = props["Ticket Name"]["title"][0]["text"]["content"]
        status = props["Status"]["select"]["name"]
        priority = props["Priority"]["select"]["name"]
        due_date = props["Due Date"]["date"]["start"] if props["Due Date"]["date"] else "N/A"

        print(f"\n🎟️  Ticket: {title}")
        print(f"📌 Status: {status}")
        print(f"⚠️ Priority: {priority}")
        print(f"🗓️  Due: {due_date}")


# ✅ Correct
print(TOOL_REGISTRY["gmail_send"].invoke({
    "to": "vighneshpathak1411@gmail.com",
    "message": "Hello from LangChain Tool!"
}))

# ✅ Slack Post Tool (wrap message in .invoke)
print(TOOL_REGISTRY["slack_post"].invoke("Testing Slack integration"))
