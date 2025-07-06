from pydantic import BaseModel
from typing import List, Any
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