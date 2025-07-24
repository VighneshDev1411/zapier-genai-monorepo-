from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from sqlalchemy.orm import relationship
from app.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=True)  # Added name field for Google users
    password_hash = Column(String, nullable=True)  # Already nullable for Google users
    created_at = Column(DateTime, default=datetime.utcnow)
    flows = relationship("Flow", back_populates="owner")