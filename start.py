#!/usr/bin/env python3
"""
Quick start script for AI Document Processor
"""

import subprocess
import sys
import time
import webbrowser
from pathlib import Path

def check_dependencies():
    """Check if required packages are installed"""
    required = ['fastapi', 'uvicorn', 'sqlalchemy', 'pillow', 'pytesseract']
    missing = []
    
    for package in required:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing.append(package)
    
    if missing:
        print("Missing packages:", ', '.join(missing))
        print("Run: pip install -r requirements.txt")
        return False
    
    print("All dependencies installed")
    return True

def main():
    print("AI Document Processor - Quick Start")
    print("=" * 50)
    
    if not check_dependencies():
        return
    
    print("\nStarting server...")
    print("Server will be at: http://localhost:8000")
    print("API docs will be at: http://localhost:8000/docs")
    print("Press Ctrl+C to stop")
    print("-" * 50)
    
    try:
        # Start the server
        subprocess.run([sys.executable, "main.py"])
    except KeyboardInterrupt:
        print("\nServer stopped")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
