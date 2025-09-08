from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
import shutil
import logging
from datetime import datetime

from database import get_db, init_database
from models import Document
from ai_services import DocumentProcessor
from config import settings

# Configure logging
logging.basicConfig(level=getattr(logging, settings.log_level))
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="AI Document Processor",
    description="Intelligent document processing with OCR and NLP",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize document processor
processor = DocumentProcessor()

# Create directories
os.makedirs(settings.upload_dir, exist_ok=True)
os.makedirs(settings.processed_dir, exist_ok=True)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_database()
    logger.info("AI Document Processor started successfully")


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "AI Document Processor API",
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "services": {
            "database": "connected",
            "ocr": "available",
            "nlp": "available" if settings.openai_api_key else "fallback_mode"
        },
        "timestamp": datetime.now().isoformat()
    }


@app.post("/upload")
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload and process a document
    
    Args:
        file: The document file to upload
        background_tasks: FastAPI background tasks
        db: Database session
        
    Returns:
        Document processing job information
    """
    try:
        # Validate file
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        if file.size > settings.max_file_size:
            raise HTTPException(
                status_code=413, 
                detail=f"File too large. Maximum size: {settings.max_file_size} bytes"
            )
        
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(settings.upload_dir, unique_filename)
        
        # Save uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Create database record
        document = Document(
            filename=unique_filename,
            original_filename=file.filename,
            file_path=file_path,
            file_size=file.size,
            mime_type=file.content_type or "application/octet-stream",
            status="pending"
        )
        
        db.add(document)
        db.commit()
        db.refresh(document)
        
        # Start background processing
        background_tasks.add_task(process_document_task, document.id, file_path, file.content_type)
        
        logger.info(f"Document uploaded successfully: {document.id}")
        
        return {
            "message": "Document uploaded successfully",
            "document_id": document.id,
            "filename": file.filename,
            "status": "processing",
            "estimated_completion": "2-5 minutes"
        }
        
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@app.get("/documents")
async def list_documents(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    List all documents with optional filtering
    
    Args:
        skip: Number of documents to skip
        limit: Maximum number of documents to return
        status: Filter by processing status
        db: Database session
        
    Returns:
        List of documents
    """
    try:
        query = db.query(Document)
        
        if status:
            query = query.filter(Document.status == status)
        
        documents = query.offset(skip).limit(limit).all()
        
        return {
            "documents": [doc.to_dict() for doc in documents],
            "total": len(documents),
            "skip": skip,
            "limit": limit
        }
        
    except Exception as e:
        logger.error(f"Failed to list documents: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to list documents: {str(e)}")


@app.get("/documents/{document_id}")
async def get_document(
    document_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific document by ID
    
    Args:
        document_id: The document ID
        db: Database session
        
    Returns:
        Document details
    """
    try:
        document = db.query(Document).filter(Document.id == document_id).first()
        
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        return document.to_dict()
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get document {document_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get document: {str(e)}")


@app.get("/documents/{document_id}/results")
async def get_document_results(
    document_id: int,
    db: Session = Depends(get_db)
):
    """
    Get processing results for a document
    
    Args:
        document_id: The document ID
        db: Database session
        
    Returns:
        Document processing results
    """
    try:
        document = db.query(Document).filter(Document.id == document_id).first()
        
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        if document.status != "completed":
            return {
                "status": document.status,
                "message": "Document processing not completed yet"
            }
        
        return {
            "document_id": document.id,
            "status": document.status,
            "extracted_text": document.extracted_text,
            "structured_data": document.structured_data,
            "confidence_score": document.confidence_score,
            "document_type": document.document_type,
            "key_entities": document.key_entities,
            "summary": document.summary,
            "sentiment_score": document.sentiment_score,
            "processing_time": (
                document.processing_completed_at - document.processing_started_at
            ).total_seconds() if document.processing_started_at and document.processing_completed_at else None
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get results for document {document_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get results: {str(e)}")


@app.delete("/documents/{document_id}")
async def delete_document(
    document_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a document and its associated files
    
    Args:
        document_id: The document ID
        db: Database session
        
    Returns:
        Deletion confirmation
    """
    try:
        document = db.query(Document).filter(Document.id == document_id).first()
        
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Delete file from disk
        if os.path.exists(document.file_path):
            os.remove(document.file_path)
        
        # Delete from database
        db.delete(document)
        db.commit()
        
        logger.info(f"Document deleted successfully: {document_id}")
        
        return {
            "message": "Document deleted successfully",
            "document_id": document_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete document {document_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete document: {str(e)}")


async def process_document_task(document_id: int, file_path: str, mime_type: str):
    """
    Background task to process a document
    
    Args:
        document_id: The document ID
        file_path: Path to the document file
        mime_type: MIME type of the file
    """
    db = next(get_db())
    
    try:
        # Update document status
        document = db.query(Document).filter(Document.id == document_id).first()
        if not document:
            logger.error(f"Document not found: {document_id}")
            return
        
        document.status = "processing"
        document.processing_started_at = datetime.now()
        db.commit()
        
        # Process the document
        logger.info(f"Starting processing for document {document_id}")
        result = processor.process_document(file_path, mime_type)
        
        # Update document with results
        if result["status"] == "completed":
            document.status = "completed"
            document.processing_completed_at = datetime.now()
            document.extracted_text = result.get("extracted_text")
            document.structured_data = result.get("structured_data")
            document.confidence_score = result.get("confidence_score")
            document.document_type = result.get("document_type")
            document.key_entities = result.get("key_entities")
            document.summary = result.get("summary")
            document.sentiment_score = result.get("sentiment_score")
        else:
            document.status = "failed"
            document.processing_completed_at = datetime.now()
        
        db.commit()
        
        logger.info(f"Document processing completed: {document_id} - Status: {document.status}")
        
    except Exception as e:
        logger.error(f"Document processing failed for {document_id}: {e}")
        
        # Update document status to failed
        try:
            document = db.query(Document).filter(Document.id == document_id).first()
            if document:
                document.status = "failed"
                document.processing_completed_at = datetime.now()
                db.commit()
        except Exception as update_error:
            logger.error(f"Failed to update document status: {update_error}")
    
    finally:
        db.close()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
