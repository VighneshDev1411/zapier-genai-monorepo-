from langgraph.graph import StateGraph
from app.core.node_runners import run_generic_node
# from app.api.routes.run_flow import Node, Edge  # if not already imported
from app.schemas.flow import Node, Edge
from typing import TypedDict

class FlowState(TypedDict):
    input: str
    context: dict


def compile_flow(nodes: list[Node], edges: list[Edge]):
    # Convert list of nodes to a mapping from ID to node
    id_to_node = {n.id: n for n in nodes}

    # Build reverse adjacency map
    reverse = {}
    for edge in edges:
        reverse.setdefault(edge.target, []).append(edge.source)

    # Initialize LangGraph
    graph = StateGraph(FlowState)

    # Add nodes to graph
    for node in nodes:
        graph.add_node(node.id, run_generic_node(node, reverse))

    # Add edges to graph
    for edge in edges:
        graph.add_edge(edge.source, edge.target)

    # Identify entry and exit nodes
    start = next(n.id for n in nodes if n.type == "input")
    end = next(n.id for n in nodes if n.type == "output")

    graph.set_entry_point(start)
    graph.set_finish_point(end)

    return graph.compile()


def run_flow_langgraph(nodes: list[Node], edges: list[Edge], user_input: str):
    graph = compile_flow(nodes, edges)
    state = {"input": user_input, "context": {}}
    return graph.invoke(state)["context"]
