#!/bin/bash

# Go to backend folder
set -e
cd backend

# Install dependencies in the Railway environment


# Start the FastAPI app
uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --reload
