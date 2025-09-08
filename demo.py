
"""
AI Document Processor Demo Script

This script demonstrates the capabilities of the AI Document Processor
by processing sample documents and showing the results.
"""

import requests
import time
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import tempfile
import os


def create_sample_documents():
    """Create sample documents for demonstration"""
    documents = []
    
    # Create a sample image with text
    img = Image.new('RGB', (400, 200), color='white')
    draw = ImageDraw.Draw(img)
    
    # Add text to the image
    text = "Invoice #INV-2024-001\nDate: 2024-01-15\nAmount: $1,250.00\nCustomer: John Doe\nStatus: Paid"
    try:
        # Try to use a default font
        font = ImageFont.load_default()
    except:
        font = None
    
    draw.text((20, 20), text, fill='black', font=font)
    
    # Save image
    img_path = "sample_invoice.png"
    img.save(img_path)
    documents.append(("sample_invoice.png", "image/png"))
    
    # Create a sample text document
    text_content = """
    Project Report - Q1 2024
    
    Executive Summary:
    This quarter has been excellent for our team. We successfully completed 
    three major projects and exceeded our targets by 15%. The team morale 
    is high and client satisfaction scores are at an all-time high.
    
    Key Achievements:
    - Completed Project Alpha ahead of schedule
    - Launched Project Beta with great success
    - Improved system performance by 40%
    
    Financial Results:
    - Revenue: $2.5M (up 20% from last quarter)
    - Profit Margin: 35%
    - New Clients: 12
    
    Next Steps:
    - Begin Project Gamma in Q2
    - Expand team by 3 developers
    - Implement new automation tools
    """
    
    with open("sample_report.txt", "w") as f:
        f.write(text_content)
    documents.append(("sample_report.txt", "text/plain"))
    
    return documents


def upload_document(file_path, mime_type, base_url="http://localhost:8000"):
    """Upload a document to the API"""
    print(f"Uploading {file_path}...")
    
    with open(file_path, "rb") as f:
        files = {"file": (file_path, f, mime_type)}
        response = requests.post(f"{base_url}/upload", files=files)
    
    if response.status_code == 200:
        data = response.json()
        print(f"Upload successful! Document ID: {data['document_id']}")
        return data['document_id']
    else:
        print(f"Upload failed: {response.status_code} - {response.text}")
        return None


def wait_for_processing(document_id, base_url="http://localhost:8000", timeout=300):
    """Wait for document processing to complete"""
    print(f"Waiting for document {document_id} to process...")
    
    start_time = time.time()
    while time.time() - start_time < timeout:
        response = requests.get(f"{base_url}/documents/{document_id}")
        
        if response.status_code == 200:
            data = response.json()
            status = data['status']
            
            if status == "completed":
                print(f"Processing completed!")
                return True
            elif status == "failed":
                print(f"Processing failed!")
                return False
            else:
                print(f"Status: {status}")
                time.sleep(2)
        else:
            print(f"Error checking status: {response.status_code}")
            return False
    
    print(f"Timeout waiting for processing")
    return False


def get_results(document_id, base_url="http://localhost:8000"):
    """Get processing results for a document"""
    print(f"Getting results for document {document_id}...")
    
    response = requests.get(f"{base_url}/documents/{document_id}/results")
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to get results: {response.status_code}")
        return None


def display_results(results):
    """Display processing results in a formatted way"""
    if not results:
        return
    
    print("\n" + "="*60)
    print("PROCESSING RESULTS")
    print("="*60)
    
    # Basic info
    print(f"Document Type: {results.get('document_type', 'Unknown')}")
    print(f"Confidence Score: {results.get('confidence_score', 'N/A')}")
    print(f"Sentiment Score: {results.get('sentiment_score', 'N/A')}")
    
    # Extracted text
    if results.get('extracted_text'):
        print(f"\nExtracted Text:")
        print("-" * 40)
        text = results['extracted_text']
        if len(text) > 200:
            print(text[:200] + "...")
        else:
            print(text)
    
    # Key entities
    if results.get('key_entities'):
        print(f"\nKey Entities:")
        print("-" * 40)
        entities = results['key_entities']
        for entity_type, values in entities.items():
            if values:
                print(f"  {entity_type.title()}: {', '.join(map(str, values))}")
    
    # Summary
    if results.get('summary'):
        print(f"\nSummary:")
        print("-" * 40)
        print(results['summary'])
    
    # Processing time
    if results.get('processing_time'):
        print(f"\nProcessing Time: {results['processing_time']:.2f} seconds")
    
    print("="*60)


def main():
    """Main demo function"""
    print("AI Document Processor Demo")
    print("="*50)
    
    # Check if API is running
    try:
        response = requests.get("http://localhost:8000/health")
        if response.status_code != 200:
            print("API is not running. Please start the server first:")
            print("   python main.py")
            return
    except requests.exceptions.ConnectionError:
        print("Cannot connect to API. Please start the server first:")
        print("   python main.py")
        return
    
    print("API is running!")
    
    # Create sample documents
    print("\nCreating sample documents...")
    documents = create_sample_documents()
    
    # Process each document
    for file_path, mime_type in documents:
        print(f"\n{'='*60}")
        print(f"Processing: {file_path}")
        print(f"{'='*60}")
        
        # Upload document
        document_id = upload_document(file_path, mime_type)
        if not document_id:
            continue
        
        # Wait for processing
        if wait_for_processing(document_id):
            # Get and display results
            results = get_results(document_id)
            display_results(results)
        
        # Clean up
        try:
            os.remove(file_path)
        except:
            pass
    
    print(f"\nDemo completed!")
    print(f"Check the API documentation at: http://localhost:8000/docs")


if __name__ == "__main__":
    main()
