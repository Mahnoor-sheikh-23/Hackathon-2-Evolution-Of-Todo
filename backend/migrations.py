from sqlmodel import SQLModel, create_engine
from models import Task
from models.user import User
import os
from urllib.parse import urlparse

# Load environment variables from .env file if it exists
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("dotenv not found, relying on system environment variables")

# Database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("ERROR: DATABASE_URL environment variable not set!")
    print("Please make sure your .env file is properly configured.")
    print("Current working directory:", os.getcwd())
    print("Available environment variables:", [k for k in os.environ.keys() if 'DATABASE' in k.upper()])
    exit(1)

# For Neon Serverless PostgreSQL, we need to ensure SSL is handled properly
# Parse the URL to check if it's Neon
parsed_url = urlparse(DATABASE_URL)
if 'neon' in parsed_url.hostname:
    # For Neon, we need to add sslmode parameters if not already present
    if '?' not in DATABASE_URL:
        DATABASE_URL += "?sslmode=require"
    elif 'sslmode=' not in DATABASE_URL:
        DATABASE_URL += "&sslmode=require"

# Create the database engine
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    """
    Create database tables based on models
    """
    SQLModel.metadata.create_all(engine)

if __name__ == "__main__":
    create_db_and_tables()
    print("Database tables created successfully!")