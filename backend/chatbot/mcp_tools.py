"""
MCP (Model Context Protocol) tools for AI agent to interact with task management system.
These tools allow the AI to perform task operations using natural language.
"""

from typing import Dict, List, Optional
from sqlmodel import Session, select
from db import engine
from models.task import Task
from models.user import User
from .models import Conversation, Message
from .utils import get_db_session


def add_task(user_id: str, title: str, description: Optional[str] = None) -> Dict:
    """
    Create a new task for the user.

    Args:
        user_id: ID of the user creating the task
        title: Title of the task
        description: Optional description of the task

    Returns:
        Dictionary with task_id, status, and title
    """
    try:
        # Get database session
        with Session(engine) as db:
            # Create new task
            new_task = Task(
                user_id=user_id,
                title=title,
                description=description or "",
                completed=False
            )

            db.add(new_task)
            db.commit()
            db.refresh(new_task)

        return {
            "task_id": new_task.id,
            "status": "created",
            "title": new_task.title
        }
    except Exception as e:
        print(f"Error in add_task: {str(e)}")
        return {
            "error": f"Failed to add task: {str(e)}"
        }


def list_tasks(user_id: str, status: Optional[str] = None) -> List[Dict]:
    """
    List tasks for the user with optional status filtering.

    Args:
        user_id: ID of the user whose tasks to list
        status: Optional status filter ('all', 'pending', 'completed')

    Returns:
        List of task dictionaries
    """
    try:
        # Get database session
        with Session(engine) as db:
            # First try with the exact user_id provided
            query = select(Task).where(Task.user_id == user_id)
            tasks = db.exec(query).all()

            # If no tasks found, try with potential legacy user ID formats
            # This handles cases where different user ID schemes exist in the database
            if not tasks:
                # Try looking for tasks with numeric ID if current user_id is UUID-like
                if '-' in user_id:  # Current user_id is UUID format
                    # Attempt to find tasks with common numeric patterns
                    # This is a workaround for mixed user ID formats in the system
                    pass
                else:  # Current user_id is numeric
                    # Might need to handle reverse scenario if needed
                    pass

                # In a real scenario, we'd have a user ID mapping table
                # For now, just use the exact match query
                query = select(Task).where(Task.user_id == user_id)
                tasks = db.exec(query).all()

            if status:
                if status.lower() == 'pending':
                    tasks = [task for task in tasks if not task.completed]
                elif status.lower() == 'completed':
                    tasks = [task for task in tasks if task.completed]

        # Format tasks for return
        task_list = []
        for task in tasks:
            task_dict = {
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "completed": task.completed,
                "user_id": task.user_id,  # Include to debug user ID mapping
                "created_at": task.created_at.isoformat() if task.created_at else None,
                "updated_at": task.updated_at.isoformat() if task.updated_at else None
            }
            task_list.append(task_dict)

        return task_list
    except Exception as e:
        print(f"Error in list_tasks: {str(e)}")
        return [{"error": f"Failed to list tasks: {str(e)}"}]


def complete_task(user_id: str, task_id: int) -> Dict:
    """
    Mark a task as completed.

    Args:
        user_id: ID of the user
        task_id: ID of the task to complete

    Returns:
        Dictionary with task_id, status, and title
    """
    try:
        # Get database session
        with Session(engine) as db:
            # Get the task
            statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
            task = db.exec(statement).first()

            if not task:
                return {
                    "error": "Task not found or you don't have permission to modify it"
                }

            # Update task completion status
            task.completed = True
            db.add(task)
            db.commit()
            db.refresh(task)

        return {
            "task_id": task.id,
            "status": "completed",
            "title": task.title
        }
    except Exception as e:
        print(f"Error in complete_task: {str(e)}")
        return {
            "error": f"Failed to complete task: {str(e)}"
        }


def delete_task(user_id: str, task_id: int) -> Dict:
    """
    Delete a task.

    Args:
        user_id: ID of the user
        task_id: ID of the task to delete

    Returns:
        Dictionary with task_id, status, and title
    """
    try:
        # Get database session
        with Session(engine) as db:
            # Get the task
            statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
            task = db.exec(statement).first()

            if not task:
                return {
                    "error": "Task not found or you don't have permission to modify it"
                }

            # Delete the task
            db.delete(task)
            db.commit()

        return {
            "task_id": task.id,
            "status": "deleted",
            "title": task.title
        }
    except Exception as e:
        print(f"Error in delete_task: {str(e)}")
        return {
            "error": f"Failed to delete task: {str(e)}"
        }


def update_task(user_id: str, task_id: int, title: Optional[str] = None, description: Optional[str] = None) -> Dict:
    """
    Update task details.

    Args:
        user_id: ID of the user
        task_id: ID of the task to update
        title: New title (optional)
        description: New description (optional)

    Returns:
        Dictionary with task_id, status, and title
    """
    try:
        # Get database session
        with Session(engine) as db:
            # Get the task
            statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
            task = db.exec(statement).first()

            if not task:
                return {
                    "error": "Task not found or you don't have permission to modify it"
                }

            # Update task details if provided
            if title is not None:
                task.title = title
            if description is not None:
                task.description = description

            db.add(task)
            db.commit()
            db.refresh(task)

        return {
            "task_id": task.id,
            "status": "updated",
            "title": task.title
        }
    except Exception as e:
        print(f"Error in update_task: {str(e)}")
        return {
            "error": f"Failed to update task: {str(e)}"
        }