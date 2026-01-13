from typing import Generator
from sqlmodel import Session, select
from db import engine
from .models import Conversation, Message
from datetime import datetime
import pytz


def get_db_session() -> Generator[Session, None, None]:
    """Get database session generator for chatbot operations."""
    with Session(engine) as session:
        yield session


def create_conversation(user_id: str) -> Conversation:
    """Create a new conversation for a user."""
    with Session(engine) as db:
        conversation = Conversation(
            user_id=user_id,
            created_at=datetime.now(pytz.timezone('Asia/Karachi')),
            updated_at=datetime.now(pytz.timezone('Asia/Karachi'))
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)

    return conversation


def get_conversation(conversation_id: int) -> Conversation:
    """Get a conversation by ID."""
    with Session(engine) as db:
        conversation = db.get(Conversation, conversation_id)

    return conversation


def update_conversation_timestamp(conversation_id: int) -> Conversation:
    """Update the updated_at timestamp of a conversation."""
    with Session(engine) as db:
        conversation = db.get(Conversation, conversation_id)
        if conversation:
            conversation.updated_at = datetime.now(pytz.timezone('Asia/Karachi'))
            db.add(conversation)
            db.commit()
            db.refresh(conversation)
        return conversation


def create_message(conversation_id: int, user_id: str, role: str, content: str) -> Message:
    """Create a new message in a conversation."""
    with Session(engine) as db:
        message = Message(
            conversation_id=conversation_id,
            user_id=user_id,
            role=role,
            content=content,
            created_at=datetime.now(pytz.timezone('Asia/Karachi'))
        )

        db.add(message)
        db.commit()
        db.refresh(message)

    return message


def get_messages_for_conversation(conversation_id: int) -> list[Message]:
    """Get all messages for a specific conversation."""
    with Session(engine) as db:
        messages = db.exec(select(Message).where(Message.conversation_id == conversation_id)).all()

    return messages


def validate_user_access_to_conversation(user_id: str, conversation_id: int) -> bool:
    """Validate that a user has access to a specific conversation."""
    with Session(engine) as db:
        conversation = db.exec(
            select(Conversation).where(
                Conversation.id == conversation_id,
                Conversation.user_id == user_id
            )
        ).first()

    return conversation is not None