from sqlalchemy import Column, String, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import uuid
from app.db import Base


class Flow(Base):
    __tablename__ = "flows"

    id = Column(UUID(as_uuid=True), primary_key=True, default = uuid.uuid4)
    title = Column(String, nullable=False)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    nodes = Column(JSONB, default=[])
    edges = Column(JSONB, default=[])

    owner = relationship("User", back_populates="flows")