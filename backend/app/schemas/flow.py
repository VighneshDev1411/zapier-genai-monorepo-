from pydantic import BaseModel
from typing import List, Any, Dict
from uuid import UUID

class FlowCreate(BaseModel):
    title: str
    nodes: List[Any]
    edges: List[Any]

class FlowOut(BaseModel):
    id: UUID
    title: str
    nodes: List[Any]
    edges: List[Any]

    class Config: 
        from_attributes = True
        
class Node(BaseModel):
    id: str
    type: str
    config: Dict[str, Any] = {}

class Edge(BaseModel):
    source: str
    target: str

class FlowRunRequest(BaseModel):
    nodes: List[Node]
    edges: List[Edge]
    input: str