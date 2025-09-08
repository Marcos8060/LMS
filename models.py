from sqlalchemy import Column, Integer, String, DateTime, Text, JSON, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from datetime import datetime
from typing import Dict, Any

Base = declarative_base()


class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String(100), nullable=False)
    
    # Processing status
    status = Column(String(50), default="pending")  # pending, processing, completed, failed
    processing_started_at = Column(DateTime)
    processing_completed_at = Column(DateTime)
    
    # Extracted content
    extracted_text = Column(Text)
    structured_data = Column(JSON)
    confidence_score = Column(Integer)  # 0-100
    
    # AI analysis results
    document_type = Column(String(100))
    key_entities = Column(JSON)
    summary = Column(Text)
    sentiment_score = Column(Integer)  # -100 to 100
    
    # Metadata
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "filename": self.filename,
            "original_filename": self.original_filename,
            "file_size": self.file_size,
            "mime_type": self.mime_type,
            "status": self.status,
            "processing_started_at": self.processing_started_at.isoformat() if self.processing_started_at else None,
            "processing_completed_at": self.processing_completed_at.isoformat() if self.processing_completed_at else None,
            "extracted_text": self.extracted_text,
            "structured_data": self.structured_data,
            "confidence_score": self.confidence_score,
            "document_type": self.document_type,
            "key_entities": self.key_entities,
            "summary": self.summary,
            "sentiment_score": self.sentiment_score,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
