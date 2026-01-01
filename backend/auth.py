from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional
from pydantic import BaseModel
import jwt
import os
import hashlib
import secrets
from sqlmodel import Session, select

from models.user import User
from db import engine


# Initialize security scheme
security = HTTPBearer()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a stored hashed password
    """
    return verify_password_hash(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Hash a password using SHA-256 with a salt
    """
    # Generate a random salt
    salt = secrets.token_hex(16)
    # Create hash of password + salt
    pwdhash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    # Return salt + hash for storage
    return salt + pwdhash.hex()


def verify_password_hash(plain_password: str, stored_hash: str) -> bool:
    """
    Verify password against stored hash that includes salt
    """
    # Extract salt (first 32 chars, since hex representation of 16-byte salt is 32 chars)
    salt = stored_hash[:32]
    original_hash = stored_hash[32:]

    # Hash the input password with the same salt
    pwdhash = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt.encode('utf-8'), 100000)

    # Compare the hashes
    return pwdhash.hex() == original_hash


# Get JWT secret from environment
JWT_SECRET = os.getenv("BETTER_AUTH_SECRET", "dev-secret-change-in-production")
ALGORITHM = "HS256"


class TokenData(BaseModel):
    user_id: str
    exp: int


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Create a JWT access token
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=30)  # Default 30 minutes

    # JWT expects exp to be an integer (seconds since epoch)
    to_encode.update({"exp": int(expire.timestamp())})

    # Ensure the sub field is always a string
    if "sub" in to_encode and not isinstance(to_encode["sub"], str):
        to_encode["sub"] = str(to_encode["sub"])

    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt


def authenticate_user(email: str, password: str) -> Optional[Dict[str, Any]]:
    """
    Authenticate a user by email and password
    """
    with Session(engine) as session:
        statement = select(User).where(User.email == email)
        user = session.exec(statement).first()

        if not user or not verify_password(password, user.password_hash):
            print(f"DEBUG: Authentication failed for email: '{email}'")  # Debug
            return None

        print(f"DEBUG: Successfully authenticated user with ID: '{user.id}' and email: '{user.email}'")  # Debug
        return {
            "user_id": user.id,
            "email": user.email,
            "name": user.name
        }


def get_user_by_email(email: str) -> Optional[User]:
    """
    Get a user by email
    """
    with Session(engine) as session:
        statement = select(User).where(User.email == email)
        user = session.exec(statement).first()
        return user


def create_user(user_data: dict) -> Dict[str, Any]:
    """
    Create a new user
    """
    with Session(engine) as session:
        # Check if user already exists
        existing_user = get_user_by_email(user_data['email'])
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )

        # Hash the password
        hashed_password = get_password_hash(user_data['password'])

        # Create new user
        db_user = User(
            email=user_data['email'],
            name=user_data['name'],
            password_hash=hashed_password
        )

        session.add(db_user)
        session.commit()
        session.refresh(db_user)

        print(f"DEBUG: Created user with ID: '{db_user.id}' and email: '{db_user.email}'")  # Debug

        return {
            "user_id": db_user.id,
            "email": db_user.email,
            "name": db_user.name
        }


def verify_token(token: str) -> Dict[str, Any]:
    """
    Verify and decode JWT token
    """
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Ensure the sub field is always returned as a string
        if "sub" in payload:
            payload["sub"] = str(payload["sub"])

        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """
    Get current user from JWT token
    """
    token = credentials.credentials
    user = verify_token(token)

    # Ensure the user_id is properly formatted
    if "sub" in user:
        user["sub"] = str(user["sub"])

    return user


def validate_user_owns_task(user_id: str, task_user_id: str):
    """
    Validate that the user owns the task they're trying to access
    """
    if user_id != task_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this resource"
        )