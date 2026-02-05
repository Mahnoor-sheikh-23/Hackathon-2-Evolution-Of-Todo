#!/usr/bin/env bash
set -e

# go to backend
cd backend

# use Replit's PORT, default to 8000
PORT=${PORT:-8000}

# run uvicorn and keep it running
exec uvicorn main:app --host 0.0.0.0 --port $PORT
