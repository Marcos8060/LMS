import openai
import pytesseract
from PIL import Image
import json
import logging
from typing import Dict, Any, Optional, List
from config import settings
import re
from datetime import datetime

logger = logging.getLogger(__name__)

# Configure OpenAI
if settings.openai_api_key:
    openai.api_key = settings.openai_api_key


class OCRService:
    """Optical Character Recognition service using Tesseract"""
    
    def __init__(self):
        self.tesseract_config = '--oem 3 --psm 6'
    
    def extract_text(self, image_path: str) -> Dict[str, Any]:
        """
        Extract text from image using OCR
        
        Args:
            image_path: Path to the image file
            
        Returns:
            Dictionary containing extracted text and confidence score
        """
        try:
            # Open and process image
            image = Image.open(image_path)
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Extract text with confidence data
            data = pytesseract.image_to_data(image, config=self.tesseract_config, output_type=pytesseract.Output.DICT)
            
            # Calculate average confidence
            confidences = [int(conf) for conf in data['conf'] if int(conf) > 0]
            avg_confidence = sum(confidences) / len(confidences) if confidences else 0
            
            # Extract text
            text = pytesseract.image_to_string(image, config=self.tesseract_config)
            
            return {
                "text": text.strip(),
                "confidence": round(avg_confidence, 2),
                "word_count": len(text.split()),
                "character_count": len(text)
            }
            
        except Exception as e:
            logger.error(f"OCR extraction failed: {e}")
            return {
                "text": "",
                "confidence": 0,
                "word_count": 0,
                "character_count": 0,
                "error": str(e)
            }


class NLPService:
    """Natural Language Processing service using OpenAI"""
    
    def __init__(self):
        self.client = openai.OpenAI(api_key=settings.openai_api_key) if settings.openai_api_key else None
    
    def analyze_document(self, text: str) -> Dict[str, Any]:
        """
        Analyze document using AI to extract insights
        
        Args:
            text: Document text to analyze
            
        Returns:
            Dictionary containing analysis results
        """
        if not self.client:
            return self._fallback_analysis(text)
        
        try:
            # Create analysis prompt
            prompt = f"""
            Analyze the following document and provide:
            1. Document type (invoice, contract, report, etc.)
            2. Key entities (names, dates, amounts, etc.)
            3. Summary (2-3 sentences)
            4. Sentiment score (-100 to 100)
            
            Document text:
            {text[:4000]}  # Limit to avoid token limits
            
            Respond in JSON format:
            {{
                "document_type": "string",
                "key_entities": {{"names": [], "dates": [], "amounts": [], "other": []}},
                "summary": "string",
                "sentiment_score": number
            }}
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert document analyst. Always respond with valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                max_tokens=1000
            )
            
            # Parse response
            result = json.loads(response.choices[0].message.content)
            return result
            
        except Exception as e:
            logger.error(f"NLP analysis failed: {e}")
            return self._fallback_analysis(text)
    
    def _fallback_analysis(self, text: str) -> Dict[str, Any]:
        """Fallback analysis when OpenAI is not available"""
        # Simple regex-based analysis
        document_type = self._detect_document_type(text)
        key_entities = self._extract_entities_regex(text)
        summary = self._generate_summary(text)
        sentiment_score = self._calculate_sentiment(text)
        
        return {
            "document_type": document_type,
            "key_entities": key_entities,
            "summary": summary,
            "sentiment_score": sentiment_score
        }
    
    def _detect_document_type(self, text: str) -> str:
        """Detect document type using keywords"""
        text_lower = text.lower()
        
        if any(word in text_lower for word in ['invoice', 'bill', 'payment', 'amount due']):
            return "invoice"
        elif any(word in text_lower for word in ['contract', 'agreement', 'terms', 'conditions']):
            return "contract"
        elif any(word in text_lower for word in ['report', 'analysis', 'findings', 'conclusion']):
            return "report"
        elif any(word in text_lower for word in ['resume', 'cv', 'curriculum vitae', 'experience']):
            return "resume"
        else:
            return "general_document"
    
    def _extract_entities_regex(self, text: str) -> Dict[str, List[str]]:
        """Extract entities using regex patterns"""
        entities = {
            "names": [],
            "dates": [],
            "amounts": [],
            "other": []
        }
        
        # Extract dates (various formats)
        date_pattern = r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b|\b\d{4}[/-]\d{1,2}[/-]\d{1,2}\b'
        entities["dates"] = list(set(re.findall(date_pattern, text)))
        
        # Extract amounts (currency)
        amount_pattern = r'\$[\d,]+\.?\d*|\b\d+\.\d{2}\b'
        entities["amounts"] = list(set(re.findall(amount_pattern, text)))
        
        # Extract email addresses
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        entities["other"] = list(set(re.findall(email_pattern, text)))
        
        return entities
    
    def _generate_summary(self, text: str) -> str:
        """Generate a simple summary"""
        sentences = text.split('.')
        if len(sentences) > 3:
            return '. '.join(sentences[:2]) + '.'
        return text[:200] + '...' if len(text) > 200 else text
    
    def _calculate_sentiment(self, text: str) -> int:
        """Calculate simple sentiment score"""
        positive_words = ['good', 'great', 'excellent', 'positive', 'success', 'happy', 'pleased']
        negative_words = ['bad', 'terrible', 'negative', 'failure', 'unhappy', 'disappointed', 'problem']
        
        text_lower = text.lower()
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        if positive_count > negative_count:
            return min(100, (positive_count - negative_count) * 20)
        elif negative_count > positive_count:
            return max(-100, (negative_count - positive_count) * -20)
        else:
            return 0


class DocumentProcessor:
    """Main document processing orchestrator"""
    
    def __init__(self):
        self.ocr_service = OCRService()
        self.nlp_service = NLPService()
    
    def process_document(self, file_path: str, mime_type: str) -> Dict[str, Any]:
        """
        Process a document through the complete pipeline
        
        Args:
            file_path: Path to the document file
            mime_type: MIME type of the file
            
        Returns:
            Dictionary containing all processing results
        """
        result = {
            "file_path": file_path,
            "mime_type": mime_type,
            "processing_started_at": datetime.now().isoformat(),
            "steps_completed": [],
            "errors": []
        }
        
        try:
            # Step 1: OCR (if image)
            if mime_type.startswith('image/'):
                logger.info("Processing image with OCR")
                ocr_result = self.ocr_service.extract_text(file_path)
                result["ocr_result"] = ocr_result
                result["steps_completed"].append("ocr")
                
                if ocr_result.get("error"):
                    result["errors"].append(f"OCR failed: {ocr_result['error']}")
                    return result
                
                text = ocr_result["text"]
            else:
                # For text files, read directly
                with open(file_path, 'r', encoding='utf-8') as f:
                    text = f.read()
                result["steps_completed"].append("text_extraction")
            
            # Step 2: NLP Analysis
            if text.strip():
                logger.info("Performing NLP analysis")
                nlp_result = self.nlp_service.analyze_document(text)
                result["nlp_result"] = nlp_result
                result["steps_completed"].append("nlp_analysis")
            else:
                result["errors"].append("No text extracted from document")
                return result
            
            # Step 3: Compile final results
            result["extracted_text"] = text
            result["document_type"] = nlp_result.get("document_type", "unknown")
            result["key_entities"] = nlp_result.get("key_entities", {})
            result["summary"] = nlp_result.get("summary", "")
            result["sentiment_score"] = nlp_result.get("sentiment_score", 0)
            result["confidence_score"] = ocr_result.get("confidence", 100) if mime_type.startswith('image/') else 100
            
            result["processing_completed_at"] = datetime.now().isoformat()
            result["status"] = "completed"
            
            logger.info(f"Document processing completed successfully: {file_path}")
            
        except Exception as e:
            logger.error(f"Document processing failed: {e}")
            result["errors"].append(str(e))
            result["status"] = "failed"
            result["processing_completed_at"] = datetime.now().isoformat()
        
        return result
