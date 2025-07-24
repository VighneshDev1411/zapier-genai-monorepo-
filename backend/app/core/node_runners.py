from app.core.tool_registry import TOOL_REGISTRY
from app.agents.agent_runner import run_agent_node
from openai import OpenAI

client = OpenAI()

def run_generic_node(node, reverse_map):
    node_id = node.id
    node_type = node.type
    config = node.config or {}

    def runner(state):
        context = state.get("context", {})
        input_text = state.get("input", "")
        sources = reverse_map.get(node_id, [])
        input_from_source = context.get(sources[-1]) if sources else input_text

        if node_type == "input":
            context[node_id] = input_text

        elif node_type == "llm":
            prompt = config.get("prompt", "")
            prompt = prompt.replace("{{input}}", input_from_source)
            res = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}]
            )
            context[node_id] = res.choices[0].message.content

        elif node_type == "tool":
            tool_type = config.get("tool_type")
            tool_func = TOOL_REGISTRY.get(tool_type)
            result = tool_func(input_from_source) if tool_func else f"[Error] Unknown tool: {tool_type}"
            context[node_id] = result

        elif node_type == "agent":
            prompt = config.get("prompt", "")
            prompt = prompt.replace("{{input}}", input_from_source)
            tools = [TOOL_REGISTRY[k] for k in config.get("tools", []) if k in TOOL_REGISTRY]
            context[node_id] = run_agent_node(prompt, tools)

        elif node_type == "code":
            code = config.get("code", "")
            try:
                output = eval(code.replace("{{input}}", f'"{input_from_source}"'))
            except Exception as e:
                output = f"[CodeError] {str(e)}"
            context[node_id] = output

        elif node_type == "output":
            context[node_id] = input_from_source

        return {"input": input_text, "context": context}

    return runner
