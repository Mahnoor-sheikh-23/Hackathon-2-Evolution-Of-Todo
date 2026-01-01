from sqlmodel import create_engine
import os
from urllib.parse import urlparse
from models.user import User  # Import User model to ensure it's included in metadata

# Get database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Fallback to a default PostgreSQL connection for development
    DATABASE_URL = "postgresql://username:password@localhost:5432/todo_app"
    print("WARNING: DATABASE_URL not found in environment. Using default.")

# For Neon Serverless PostgreSQL, we need to ensure SSL and connection parameters are handled properly
parsed_url = urlparse(DATABASE_URL)
if 'neon' in parsed_url.hostname:
    # For Neon, we need to add connection parameters for proper SSL handling
    if '?' not in DATABASE_URL:
        DATABASE_URL += "?sslmode=require"
    elif 'sslmode=' not in DATABASE_URL:
        DATABASE_URL += "&sslmode=require"

# Create the database engine with proper connection pooling
engine = create_engine(
    DATABASE_URL,
    echo=True,
    pool_pre_ping=True,  # Verify connections before use
    pool_recycle=300,    # Recycle connections every 5 minutes
    pool_size=5,         # Number of connection pools
    max_overflow=10      # Max additional connections beyond pool_size
)