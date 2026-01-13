from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
import os
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

from db import engine
from models.task import Task
from sqlmodel import SQLModel
from routes.tasks import router as tasks_router
from routes.auth import router as auth_router
from routes.users import router as users_router
from chatbot.routes import router as chatbot_router

# Create the FastAPI app
app = FastAPI(
    title="Todo API - Phase II",
    description="REST API for Todo Full-Stack Web Application - Phase II",
    version="1.0.0"
)

# Add CORS middleware
import os

# Determine origins based on environment
environment = os.getenv("ENVIRONMENT", "development")
railway_url = os.getenv("RAILWAY_PUBLIC_DOMAIN", "")

if environment == "production" or railway_url:
    # Production environment - specify origins
    allowed_origins = [
        "https://hackathon-2-evolution-of-todo-production.up.railway.app",  # Railway domain
        "https://*.railway.app",  # Wildcard for railway subdomains
    ]
    # Add custom domain if available
    custom_domain = os.getenv("CUSTOM_DOMAIN")
    if custom_domain:
        allowed_origins.append(f"https://{custom_domain}")
else:
    # Development environment - allow all for local development
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allowed_origins = [
    "https://evolution-of-todo-app.netlify.app",  # Your frontend
    "http://localhost:3000",                       # Local dev
    "http://127.0.0.1:3000",
    "https://hackathon-2-evolution-of-todo-production.up.railway.app"  # optional, if backend calls itself
]
,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # Only expose the authorization header for client access
    expose_headers=["Access-Control-Allow-Origin"]
)

# Include the auth, user, and task routes with a base path
app.include_router(auth_router, prefix="/api", tags=["auth"])
app.include_router(users_router, prefix="/api", tags=["users"])
app.include_router(tasks_router, prefix="/api", tags=["tasks"])
app.include_router(chatbot_router, tags=["chatbot"])

# Create the database tables
@app.on_event("startup")
def on_startup():
    # Import models to ensure they're included in metadata
    from models import Task
    from models.user import User
    from chatbot.models import Conversation, Message
    SQLModel.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Todo API - Phase II", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected"}

# Add a test endpoint to verify the API is working
@app.get("/test")
def test_endpoint():
    return {"message": "API is working correctly!"}

if __name__ == "__main__":
    import uvicorn
    import os

    # Get port from environment, default to 8000
    port = int(os.getenv("PORT", 8000))

    # Determine host based on environment
    # Railway sets HOST environment variable, otherwise use default
    host = os.getenv("HOST", "0.0.0.0")

    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True if port == 8000 else False  # Disable reload in production
    )