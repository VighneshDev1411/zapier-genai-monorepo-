from fastapi import APIRouter, Depends, HTTPException
from app.db import get_db
from app.models.flow import Flow
from app.api.deps import get_current_user
from app.executor.executor import run_flow
from sqlalchemy.orm import Session
from uuid import UUID
from app.core.flow_executor import execute_flow


flow_run_router = APIRouter(prefix="/flows", tags=["Flow Run"])

@flow_run_router.post("/{flow_id}/run")
def run_flow_endpoint(flow_id: UUID, input: str, db: Session = Depends(get_db), user=Depends(get_current_user)):
    flow = db.query(Flow).filter(Flow.id == flow_id, Flow.owner_id == user.id).first()
    if not flow:
        raise HTTPException(status_code=404, detail="Flow not found")
    
    try:
        flow_data = {
        "nodes": flow.nodes,
        "edges": flow.edges
    }
        result = execute_flow(flow_data, input)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
