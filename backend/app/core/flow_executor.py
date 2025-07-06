from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage
from app.models.flow import Flow
from langchain.tools import tool
from typing import Dict, List
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
import os
import base64
import requests
from dotenv import load_dotenv
from collections import deque, defaultdict
from notion_client import Client


load_dotenv()

SLACK_BOT_TOKEN = os.getenv("SLACK_BOT_TOKEN")
SLACK_CHANNEL_ID = os.getenv("SLACK_CHANNEL_ID")
notion = Client(auth=os.getenv("NOTION_API_KEY"))
PAGE_ID = os.getenv("NOTION_PAGE_ID")

@tool
def send_slack_message(message: str) -> str:
    """Send a message to Slack using the Slack API."""
    if not SLACK_BOT_TOKEN or not SLACK_CHANNEL_ID:
        return "Slack credentials not configured."

    url = "https://slack.com/api/chat.postMessage"
    headers = {
        "Authorization": f"Bearer {SLACK_BOT_TOKEN}",
        "Content-Type": "application/json",
    }
    data = {
        "channel": SLACK_CHANNEL_ID,
        "text": message,
    }

    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200 and response.json().get("ok"):
        return f"💬 Slack message sent: {message}"
    else:
        return f"Failed to send Slack message: {response.text}"

@tool 
def send_to_notion(message:str) -> str:
    """Send a message to Notion by creating a new page."""
    try:
        notion.pages.create(
            parent = {"page_id": PAGE_ID},
            properties={
                "title": [
                    {
                        "text": {
                            "content":"GenAI Output"
                        }
                    }
                ]
            },
            children=[
                {
                    "object": "block",
                    "type": "paragraph",
                    "paragraph": {
                        "rich_text": [{"type": "text", "text": {"content": message}}]
                    }
                }
            ]
        )
        return f"Notion page created with message."
    except Exception as e:
        return f"Failed to send to Notion: {str(e)}"

TOOL_REGISTRY = {
    "slack": send_slack_message,
    "notion": send_to_notion
}



def execute_flow_with_langchain(flow: Flow, input_text: str) -> str:
    llm = ChatOpenAI(model="gpt-3.5-turbo")
    context: Dict[str, str] = {}

    # Step 1: Build reverse edge map and graph
    graph = defaultdict(list)
    indegree = defaultdict(int)

    for edge in flow.edges:
        source = edge["source"]
        target = edge["target"]
        graph[source].append(target)
        indegree[target] += 1

    # Step 2: Topological sort
    queue = deque()
    for node in flow.nodes:
        if indegree[node["id"]] == 0:
            queue.append(node["id"])

    node_map = {n["id"]: n for n in flow.nodes}
    execution_order = []

    while queue:
        current = queue.popleft()
        execution_order.append(current)
        for neighbor in graph[current]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    print("[DEBUG] Execution Order:", execution_order)

    # Step 3: Execute in sorted order
    reverse = defaultdict(list)
    for edge in flow.edges:
        reverse[edge["target"]].append(edge["source"])

    for node_id in execution_order:
        node = node_map[node_id]
        node_type = node["type"]
        config = node.get("config", {})

        if node_type == "input":
            context[node_id] = input_text
            print(f"[INPUT] {node_id} = {input_text}")

        elif node_type == "llm":
            prompt = config.get("prompt", "")
            sources = reverse.get(node_id, [])
            if sources:
                latest = context.get(sources[-1], "")
                prompt = f"{prompt.strip()}: {latest}"
            print(f"[LLM] {node_id} = {prompt}")
            response = llm.invoke([HumanMessage(content=prompt)])
            context[node_id] = response.content

        elif node_type == "tool":
            tool_type = config.get("tool_type", "slack")
            tool_input = config.get("tool_input", "")
            sources = reverse.get(node_id, [])
            # if sources:
            #     latest = context.get(sources[-1], "")
            #     tool_input = f"{tool_input.strip()}: {latest}"
            if sources:
                tool_input = context.get(sources[-1], "")

            print(f"[TOOL] {node_id} → {tool_input}")
            if tool_type in TOOL_REGISTRY:
                context[node_id] = TOOL_REGISTRY[tool_type](tool_input)
            else:
                context[node_id] = f"Tool {tool_type} not implemented."

        elif node_type == "output":
            val = "\n".join(context.get(src, "") for src in reverse.get(node_id, []))
            context[node_id] = val

        elif node_type == "code_convert":
            code_input = ""
            for sid in reverse.get(node_id, []):
                code_input += context.get(sid, "") + "\n"

            lang = config.get("lang", "JavaScript")
            prompt = f"Convert this Python code to {lang}:\n\n{code_input.strip()}"
            
            response = llm.invoke([HumanMessage(content=prompt)])
            context[node_id] = response.content

    return context.get(execution_order[-1], "No result")
