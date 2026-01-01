#!/bin/bash
set -e

# Move to backend folder
cd backend

# Create a virtual environment (Linux style)
python -m venv .venv

# Activate the virtual environment
source .venv/bin/activate

# Upgrade pip and install requirements
pip install --upgrade pip
pip install -r requirements.txt

# Start FastAPI
uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --reload
