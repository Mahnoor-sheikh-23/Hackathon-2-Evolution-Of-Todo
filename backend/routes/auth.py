from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlmodel import Session
from typing import Dict, Any
from auth import authenticate_user, create_user, create_access_token
from db import engine
from models.user import UserCreate

router = APIRouter(prefix="/auth", tags=["auth"])


def get_session():
    with Session(engine) as session:
        yield session


@router.post("/signup", response_model=Dict[str, Any])
def signup(user_data: UserCreate):
    """
    Register a new user
    """
    try:
        print(f"DEBUG: Signup request for email: '{user_data.email}'")  # Debug
        # Create user in database
        user_info = create_user(user_data.dict())

        # Create access token
        token_data = {"sub": user_info["user_id"]}
        access_token = create_access_token(data=token_data)

        print(f"DEBUG: Signup successful for email: '{user_data.email}', user_id: '{user_info['user_id']}'")  # Debug
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user_info["user_id"],
                "email": user_info["email"],
                "name": user_info["name"]
            }
        }
    except HTTPException as e:
        print(f"DEBUG: Signup failed for email: '{user_data.email}', error: {e.detail}")  # Debug
        # Re-raise HTTP exceptions (like duplicate email)
        raise
    except Exception as e:
        print(f"DEBUG: Signup failed with exception for email: '{user_data.email}', error: {str(e)}")  # Debug
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during registration"
        )


@router.post("/login", response_model=Dict[str, Any])
def login(email: str = Form(...), password: str = Form(...)):
    """
    Authenticate user and return access token
    """
    print(f"DEBUG: Login request for email: '{email}'")  # Debug
    user = authenticate_user(email, password)

    if not user:
        print(f"DEBUG: Login failed for email: '{email}' - invalid credentials")  # Debug
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    token_data = {"sub": user["user_id"]}
    access_token = create_access_token(data=token_data)

    print(f"DEBUG: Login successful for email: '{email}', user_id: '{user['user_id']}'")  # Debug
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["user_id"],
            "email": user["email"],
            "name": user["name"]
        }
    }