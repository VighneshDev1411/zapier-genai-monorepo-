import os
from notion_client import Client
from langchain.tools import tool

notion = Client(auth=os.getenv("NOTION_API_KEY"))

@tool
def query_notion_database(database_id: str):
    """Query a Notion database and return the result as JSON."""
    try:
        response = notion.databases.query(database_id=database_id)
        return response
    except Exception as e:
        return f"[NotionError] {str(e)}"
