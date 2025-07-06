import requests
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI()

def run_flow(nodes, edges, user_input):
    id_to_node = {n["id"]: n for n in nodes}
    graph = {n["id"]: [] for n in nodes}
    reverse = {n["id"]: [] for n in nodes}

    for edge in edges:
        graph[edge["source"]].append(edge["target"])
        reverse[edge["target"]].append(edge["source"])

    context = {}

    def resolve(node_id):
        node = id_to_node[node_id]
        node_type = node["type"]
        config = node.get("config", {})

        if node_type == "input":
            context[node_id] = user_input
        
        elif node_type == "llm":
            prompt_template = config.get("prompt", "")
            
            # Determine actual input
            llm_input = None

            # Use first connected node's output if exists
            sources = reverse.get(node_id, [])
            for source_id in sources:
                if source_id in context:
                    llm_input = context[source_id]
                    break

            # Fallback to initial flow input if nothing else
            if llm_input is None:
                llm_input = context.get("input", "")  # fallback to raw user input

            # Fill prompt
            prompt_filled = prompt_template.replace("{{input}}", llm_input)

            # Call OpenAI
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that translates English to French."},
                    {"role": "user", "content": prompt_filled}
                ]
            )

            # Store response in context
            context[node_id] = response.choices[0].message.content

        elif node_type == "http":
            url = config.get("url")
            method = config.get("method", "GET").upper()
            for source_id in reverse[node_id]:
                url = url.replace("{{input}}", context[source_id])
            response = requests.request(method, url)
            context[node_id] = response.text

        elif node_type == "code":
            code = config.get("code", "")
            for source_id in reverse[node_id]:
                code = code.replace("{{input}}", f'"{context[source_id]}"')
            context[node_id] = eval(code)

        elif node_type == "output":
            for source_id in reverse[node_id]:
                context[node_id] = context[source_id]

    visited = set()

    def dfs(node_id):
        if node_id in visited: return
        for parent in reverse[node_id]:
            dfs(parent)
        resolve(node_id)
        visited.add(node_id)

    output_node = next(n["id"] for n in nodes if n["type"] == "output")
    dfs(output_node)
    return context[output_node]