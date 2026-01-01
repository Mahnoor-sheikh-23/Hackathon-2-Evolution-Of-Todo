from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Dict, Any
from auth import get_current_user
from db import engine
from models.user import User, UserRead, UserUpdate

def get_session():
    with Session(engine) as session:
        yield session

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/{user_id}", response_model=UserRead)
def get_user_profile(
    user_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get user profile information
    """
    # Only allow users to access their own profile
    authenticated_user_id = current_user.get("sub")
    if authenticated_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this profile"
        )

    # Fetch user from database
    user = session.exec(select(User).where(User.id == user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user


@router.put("/{user_id}", response_model=UserRead)
def update_user_profile(
    user_id: str,
    user_update: UserUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Update user profile information
    """
    # Only allow users to update their own profile
    authenticated_user_id = current_user.get("sub")
    if authenticated_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this profile"
        )

    # Fetch user from database
    user = session.exec(select(User).where(User.id == user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Update user fields if provided
    if user_update.name is not None:
        user.name = user_update.name
    if user_update.email is not None:
        user.email = user_update.email

    # Commit changes to database
    session.add(user)
    session.commit()
    session.refresh(user)

    return user