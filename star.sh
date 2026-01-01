#!/bin/bash
# Move into backend folder
cd backend

# Upgrade pip and install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Start the FastAPI app
uvicorn main:app --host 0.0.0.0 --port $PORT
