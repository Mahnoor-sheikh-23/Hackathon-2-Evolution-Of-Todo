"""
API routes for the AI chatbot functionality.
Handles chat interactions, conversation management, and message history.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from pydantic import BaseModel
from sqlmodel import Session, select
from auth import get_current_user
from typing import Union, Dict, Any
from models.user import User
from db import engine
from .models import Conversation, Message, ConversationRead, MessageRead
from .utils import (
    create_conversation,
    get_conversation,
    create_message,
    get_messages_for_conversation,
    validate_user_access_to_conversation
)
from .agent_runner import get_chatbot_agent
from .mcp_tools import list_tasks


router = APIRouter(prefix="/api", tags=["chatbot"])


class ChatRequest(BaseModel):
    message: str
    conversation_id: int = None  # Optional - if not provided, creates new conversation


class ChatResponse(BaseModel):
    response: str
    conversation_id: int
    message_id: int
    tool_calls: List[dict] = []


@router.post("/{user_id}/chat")
async def chat(
    user_id: str,
    request: ChatRequest,
    current_user: Union[User, Dict[str, Any]] = Depends(get_current_user)
):
    """
    Handle chat messages from the frontend and respond using the AI agent.

    Args:
        user_id: ID of the user sending the message (should match authenticated user)
        request: Chat request containing the message and optional conversation_id
        current_user: The authenticated user (from JWT token)

    Returns:
        ChatResponse with AI response and conversation details
    """
    # Verify that the user_id in the URL matches the authenticated user
    # Handle both User object and dict representations
    # For User objects, use .id; for JWT payloads, use 'sub' field; for dict, use 'user_id' or 'id'
    if isinstance(current_user, dict):
        authenticated_user_id = current_user.get('sub') or current_user.get('user_id') or current_user.get('id')
    else:
        authenticated_user_id = getattr(current_user, 'id', None)
    if authenticated_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's chat"
        )

    # Get the chatbot agent instance
    agent = get_chatbot_agent()

    # Get or create conversation
    if request.conversation_id:
        # Validate that the user has access to this conversation
        if not validate_user_access_to_conversation(user_id, request.conversation_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found or access denied"
            )
        conversation = get_conversation(request.conversation_id)
    else:
        # Create a new conversation
        conversation = create_conversation(user_id)

    # Get conversation history for context
    messages = get_messages_for_conversation(conversation.id)
    conversation_history = []
    for msg in messages:
        conversation_history.append({
            "role": msg.role,
            "content": msg.content
        })

    # Process the message with the AI agent
    result = await agent.process_message(
        user_id=user_id,
        message=request.message,
        conversation_history=conversation_history
    )

    # Create message records for both user and assistant
    user_message = create_message(
        conversation_id=conversation.id,
        user_id=user_id,
        role="user",
        content=request.message
    )

    # Update conversation timestamp
    from .utils import update_conversation_timestamp
    update_conversation_timestamp(conversation.id)

    assistant_response = result.get("response", "I'm sorry, I couldn't process that request.")
    assistant_message = create_message(
        conversation_id=conversation.id,
        user_id=user_id,
        role="assistant",
        content=assistant_response
    )

    # Update conversation timestamp again after assistant response
    update_conversation_timestamp(conversation.id)

    # Return the response
    return ChatResponse(
        response=assistant_response,
        conversation_id=conversation.id,
        message_id=assistant_message.id,
        tool_calls=result.get("tool_calls", [])
    )


@router.get("/{user_id}/conversations", response_model=list[ConversationRead])
async def get_user_conversations(
    user_id: str,
    current_user: Union[User, Dict[str, Any]] = Depends(get_current_user)
):
    """
    Get a list of all conversations for the user.
    """
    # Handle both User object and dict representations
    # For User objects, use .id; for JWT payloads, use 'sub' field; for dict, use 'user_id' or 'id'
    if isinstance(current_user, dict):
        authenticated_user_id = current_user.get('sub') or current_user.get('user_id') or current_user.get('id')
    else:
        authenticated_user_id = getattr(current_user, 'id', None)
    if authenticated_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's conversations"
        )

    with Session(engine) as db:
        conversations = db.exec(
            select(Conversation).where(Conversation.user_id == user_id)
        ).all()
    return conversations


@router.get("/{user_id}/conversations/{conversation_id}/messages", response_model=list[MessageRead])
async def get_conversation_messages(
    user_id: str,
    conversation_id: int,
    current_user: Union[User, Dict[str, Any]] = Depends(get_current_user)
):
    """
    Get all messages for a specific conversation.
    """
    # Handle both User object and dict representations
    # For User objects, use .id; for JWT payloads, use 'sub' field; for dict, use 'user_id' or 'id'
    if isinstance(current_user, dict):
        authenticated_user_id = current_user.get('sub') or current_user.get('user_id') or current_user.get('id')
    else:
        authenticated_user_id = getattr(current_user, 'id', None)
    if authenticated_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's conversation"
        )

    # Validate access to the conversation
    if not validate_user_access_to_conversation(user_id, conversation_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found or access denied"
        )

    messages = get_messages_for_conversation(conversation_id)
    return messages


@router.delete("/{user_id}/conversations/{conversation_id}")
async def delete_conversation(
    user_id: str,
    conversation_id: int,
    current_user: Union[User, Dict[str, Any]] = Depends(get_current_user)
):
    """
    Delete a specific conversation.
    """
    # Handle both User object and dict representations
    # For User objects, use .id; for JWT payloads, use 'sub' field; for dict, use 'user_id' or 'id'
    if isinstance(current_user, dict):
        authenticated_user_id = current_user.get('sub') or current_user.get('user_id') or current_user.get('id')
    else:
        authenticated_user_id = getattr(current_user, 'id', None)
    if authenticated_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's conversation"
        )

    # Validate access to the conversation
    if not validate_user_access_to_conversation(user_id, conversation_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found or access denied"
        )

    from .models import Conversation

    with Session(engine) as db:
        conversation = db.get(Conversation, conversation_id)
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )

        db.delete(conversation)
        db.commit()

    return {"message": "Conversation deleted successfully"}


@router.get("/{user_id}/tasks")
async def get_user_tasks(
    user_id: str,
    status_filter: str = None,
    current_user: Union[User, Dict[str, Any]] = Depends(get_current_user)
):
    """
    Get tasks for the user with optional status filtering.
    This endpoint is for the frontend to display tasks separately from chat.
    """
    # Handle both User object and dict representations
    # For User objects, use .id; for JWT payloads, use 'sub' field; for dict, use 'user_id' or 'id'
    if isinstance(current_user, dict):
        authenticated_user_id = current_user.get('sub') or current_user.get('user_id') or current_user.get('id')
    else:
        authenticated_user_id = getattr(current_user, 'id', None)
    if authenticated_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's tasks"
        )

    # Use the existing MCP tool to list tasks
    tasks = list_tasks(user_id, status_filter)

    # Check if there was an error
    if tasks and isinstance(tasks, list) and len(tasks) > 0 and "error" in tasks[0]:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=tasks[0]["error"]
        )

    return tasks