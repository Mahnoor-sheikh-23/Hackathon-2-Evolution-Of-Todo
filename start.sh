#!/bin/bash
# star.sh / start.sh for Railway

# Exit immediately if any command fails
set -e

# Move to backend folder
cd backend

# Make sure Python is available
echo "Python version: $(python3 --version)"

# Install dependencies
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt

# Start the FastAPI app
# Use --host 0.0.0.0 and --port $PORT for Railway
python3 -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --reload
