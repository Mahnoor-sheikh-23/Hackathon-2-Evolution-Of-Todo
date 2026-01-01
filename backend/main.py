# from fastapi import FastAPI, Depends, HTTPException, status
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.security import HTTPBearer
# import os
# from dotenv import load_dotenv

# # Load environment variables from .env file if it exists
# load_dotenv()

# from db import engine
# from models.task import Task
# from sqlmodel import SQLModel
# from routes.tasks import router as tasks_router
# from routes.auth import router as auth_router
# from routes.users import router as users_router

# # Create the FastAPI app
# app = FastAPI(
#     title="Todo API - Phase II",
#     description="REST API for Todo Full-Stack Web Application - Phase II",
#     version="1.0.0"
# )

# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # In production, specify your frontend domain
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
#     # Only expose the authorization header for client access
#     expose_headers=["Access-Control-Allow-Origin"]
# )

# # Include the auth, user, and task routes with a base path
# app.include_router(auth_router, prefix="/api", tags=["auth"])
# app.include_router(users_router, prefix="/api", tags=["users"])
# app.include_router(tasks_router, prefix="/api", tags=["tasks"])

# # Create the database tables
# @app.on_event("startup")
# def on_startup():
#     # Import models to ensure they're included in metadata
#     from models import Task
#     from models.user import User
#     SQLModel.metadata.create_all(bind=engine)

# @app.get("/")
# def read_root():
#     return {"message": "Todo API - Phase II", "status": "running"}

# @app.get("/health")
# def health_check():
#     return {"status": "healthy", "database": "connected"}

# # Add a test endpoint to verify the API is working
# @app.get("/test")
# def test_endpoint():
#     return {"message": "API is working correctly!"}

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(
#         "main:app",
#         host="0.0.0.0",
#         port=int(os.getenv("PORT", 8000)),
#         reload=True
#     )


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# ✅ Fixed imports: include backend as package
from backend.db import engine
from backend.models.task import Task
from backend.models.user import User
from backend.routes.tasks import router as tasks_router
from backend.routes.auth import router as auth_router
from backend.routes.users import router as users_router
from sqlmodel import SQLModel

# Create the FastAPI app
app = FastAPI(
    title="Todo API - Phase II",
    description="REST API for Todo Full-Stack Web Application - Phase II",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Access-Control-Allow-Origin"]
)

# Include routers
app.include_router(auth_router, prefix="/api", tags=["auth"])
app.include_router(users_router, prefix="/api", tags=["users"])
app.include_router(tasks_router, prefix="/api", tags=["tasks"])

# Create database tables on startup
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Todo API - Phase II", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected"}

@app.get("/test")
def test_endpoint():
    return {"message": "API is working correctly!"}

# Only use this if running locally; ignore in Docker
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True
    )
