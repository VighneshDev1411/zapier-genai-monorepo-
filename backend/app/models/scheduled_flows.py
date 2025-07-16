from sqlalchemy import Column, String, Boolean
from app.db import Base

class ScheduledFlow(Base):
    __tablename__ = "scheduled_flows"
    id = Column(String, primary_key=True, index=True)
    cron = Column(String)  # e.g. "0 * * * *"
    flow_id = Column(String)
    enabled = Column(Boolean, default=True)
