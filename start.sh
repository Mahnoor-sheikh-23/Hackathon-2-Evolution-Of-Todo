#!/bin/bash
set -e
cd backend

# Use the PORT Railway provides
exec uvicorn main:app --host 0.0.0.0 --port ${PORT}
