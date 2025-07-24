from app.tools.notion_tool import query_notion_database
from app.tools.gmail_tool import send_gmail
from app.tools.slack_tool import post_to_slack

TOOL_REGISTRY = {
    "notion_query": query_notion_database,
    "gmail_send": send_gmail,
    "slack_post": post_to_slack,
}


