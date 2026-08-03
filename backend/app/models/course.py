from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    price_inr = Column(Integer, nullable=False)
    duration = Column(String(100), nullable=False)
    level = Column(String(50), nullable=False)
    technologies = Column(JSON, nullable=False, default=[]) # e.g. ["React", "FastAPI", "PostgreSQL"]
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    registrations = relationship("CourseRegistration", back_populates="course", cascade="all, delete-orphan")
