# api/routes/run_flow.py
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
from app.core.flow_langgraph import run_flow_langgraph
from app.schemas.flow import FlowRunRequest

router = APIRouter()

class Node(BaseModel):
    id: str
    type: str
    config: Dict[str, Any] = {}

class Edge(BaseModel):
    source: str
    target: str

class FlowRequest(BaseModel):
    nodes: List[Node]
    edges: List[Edge]
    input: str

@router.post("/run-flow")
def run_dynamic_flow(req: FlowRunRequest):
    return {"result": run_flow_langgraph(req.nodes, req.edges, req.input)}
