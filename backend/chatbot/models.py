from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, timezone
import pytz
from pydantic import field_validator


class ConversationBase(SQLModel):
    user_id: str


class Conversation(ConversationBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(pytz.timezone('Asia/Karachi')))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(pytz.timezone('Asia/Karachi')))


class MessageBase(SQLModel):
    conversation_id: int
    user_id: str
    role: str  # "user" or "assistant"
    content: str


class Message(MessageBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int
    user_id: str
    role: str  # "user" or "assistant"
    content: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(pytz.timezone('Asia/Karachi')))

    @field_validator('role')
    @classmethod
    def validate_role(cls, v):
        if v not in ['user', 'assistant']:
            raise ValueError('Role must be either "user" or "assistant"')
        return v

    @field_validator('content')
    @classmethod
    def validate_content(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Content cannot be empty')
        return v


class ConversationCreate(ConversationBase):
    pass


class ConversationRead(ConversationBase):
    id: int
    created_at: datetime
    updated_at: datetime


class MessageCreate(MessageBase):
    role: str
    content: str

    @field_validator('role')
    @classmethod
    def validate_role(cls, v):
        if v not in ['user', 'assistant']:
            raise ValueError('Role must be either "user" or "assistant"')
        return v

    @field_validator('content')
    @classmethod
    def validate_content(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Content cannot be empty')
        return v


class MessageRead(MessageBase):
    id: int
    created_at: datetime