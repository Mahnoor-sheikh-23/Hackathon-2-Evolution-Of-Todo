from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, timezone
from pydantic import field_validator

class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)

class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str  # Reference to user managed by Better Auth (no foreign key constraint)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TaskCreate(TaskBase):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)

    @field_validator('title')
    @classmethod
    def validate_title(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Title is required and cannot be empty')
        if len(v) > 200:
            raise ValueError('Title must be less than 200 characters')
        return v

    @field_validator('description')
    @classmethod
    def validate_description(cls, v):
        if v and len(v) > 1000:
            raise ValueError('Description must be less than 1000 characters')
        return v

class TaskUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: Optional[bool] = None

    @field_validator('title', mode='before')
    @classmethod
    def validate_title_update(cls, v):
        if v is not None:
            if not v or len(v.strip()) == 0:
                raise ValueError('Title cannot be empty')
            if len(v) > 200:
                raise ValueError('Title must be less than 200 characters')
        return v

    @field_validator('description', mode='before')
    @classmethod
    def validate_description_update(cls, v):
        if v is not None and len(v) > 1000:
            raise ValueError('Description must be less than 1000 characters')
        return v

class TaskRead(TaskBase):
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime