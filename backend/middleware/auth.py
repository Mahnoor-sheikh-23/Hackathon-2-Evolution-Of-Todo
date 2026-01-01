from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, Any
import jwt
import os

# Initialize security scheme
security = HTTPBearer()

# Get JWT secret from environment
JWT_SECRET = os.getenv("BETTER_AUTH_SECRET", "dev-secret-change-in-production")
ALGORITHM = "HS256"

def verify_token(token: str) -> Dict[str, Any]:
    """
    Verify and decode JWT token
    """
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
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