from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.api.deps import get_current_user
from app.models.flow import Flow
from app.schemas.flow import FlowCreate, FlowOut
from app.schemas.run_input import RunInput
from app.core.flow_executor import execute_flow_with_langchain  # <- Import your executor logic

flow_router = APIRouter(prefix="/flows", tags=["Flows"])

@flow_router.post("/", response_model=FlowOut)
def create_flow(flow_in: FlowCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    flow = Flow(
        title=flow_in.title,
        nodes=flow_in.nodes,
        edges=flow_in.edges,
        owner_id=user.id
    )
    db.add(flow)
    db.commit()
    db.refresh(flow)
    return flow

@flow_router.get("/{flow_id}", response_model=FlowOut)
def get_flow(flow_id: UUID, db: Session = Depends(get_db), user=Depends(get_current_user)):
    flow = db.query(Flow).filter(Flow.id == flow_id, Flow.owner_id == user.id).first()
    if not flow:
        raise HTTPException(status_code=404, detail="Flow not found")
    return flow

@flow_router.get("/", response_model=list[FlowOut])
def get_flows(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Flow).filter(Flow.owner_id == user.id).all()

# ✅ NEW: POST /flows/{flow_id}/run
@flow_router.post("/{flow_id}/run")
def run_flow(flow_id: str, input_data: RunInput, db: Session = Depends(get_db), user=Depends(get_current_user)):
    flow = db.query(Flow).filter(Flow.id == flow_id, Flow.owner_id == user.id).first()
    if not flow:
        raise HTTPException(status_code=404, detail="Flow not found")
    
    try:
        result = execute_flow_with_langchain(flow, input_data.input)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
