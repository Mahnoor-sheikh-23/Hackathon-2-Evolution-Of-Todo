from sqlmodel import create_engine, text
import os
from urllib.parse import urlparse

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

# Create the database engine
engine = create_engine(DATABASE_URL, echo=True)

def add_bio_column():
    """
    Add the bio column to the user table if it doesn't exist
    """
    with engine.connect() as conn:
        # Check if the bio column already exists
        result = conn.execute(text("""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name='user' AND column_name='bio'
        """))

        if result.fetchone() is None:
            # Column doesn't exist, add it
            print("Adding bio column to user table...")
            conn.execute(text("ALTER TABLE \"user\" ADD COLUMN bio TEXT DEFAULT NULL"))
            conn.commit()
            print("Bio column added successfully!")
        else:
            print("Bio column already exists.")

if __name__ == "__main__":
    add_bio_column()
    print("Database update complete!")