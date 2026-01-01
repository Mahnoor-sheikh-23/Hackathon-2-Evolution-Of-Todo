from sqlmodel import Field, SQLModel
from typing import Optional
from datetime import datetime, timezone
import uuid


class User(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(unique=True, index=True)
    name: str
    password_hash: str  # Store hashed password
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class UserCreate(SQLModel):
    email: str
    name: str
    password: str  # Plain text password to be hashed


class UserUpdate(SQLModel):
    name: Optional[str] = None
    email: Optional[str] = None


class UserRead(SQLModel):
    id: str
    email: str
    name: str
    created_at: datetime
    updated_at: datetime