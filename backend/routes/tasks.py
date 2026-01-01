from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from auth import get_current_user
from db import engine
from models.task import Task, TaskCreate, TaskUpdate, TaskRead

router = APIRouter(prefix="/{user_id}/tasks", tags=["tasks"])

def get_session():
    with Session(engine) as session:
        yield session

@router.get("/", response_model=List[TaskRead])
def get_tasks(
    user_id: str,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Verify that the requested user_id matches the authenticated user
    authenticated_user_id = current_user.get("sub")
    print(f"DEBUG: get_tasks - authenticated_user_id='{authenticated_user_id}', path_user_id='{user_id}', user_id_type={type(authenticated_user_id)}, path_type={type(user_id)}")  # Debug
    if authenticated_user_id != user_id:
        print(f"Authorization failed in get_tasks: authenticated_user_id={authenticated_user_id}, path_user_id={user_id}")  # Debug
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view tasks for this user"
        )

    # Get all tasks for the authenticated user
    print(f"DEBUG: Querying tasks for user_id='{user_id}'")  # Debug
    statement = select(Task).where(Task.user_id == user_id)
    tasks = session.exec(statement).all()
    print(f"DEBUG: Found {len(tasks)} tasks for user_id='{user_id}'")  # Debug
    for task in tasks:
        print(f"DEBUG: Task {task.id} - user_id: '{task.user_id}'")  # Debug

    return tasks

@router.post("/", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    user_id: str,
    task: TaskCreate,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Verify that the user_id in the path matches the authenticated user
    authenticated_user_id = current_user.get("sub")
    print(f"DEBUG: create_task - authenticated_user_id='{authenticated_user_id}', path_user_id='{user_id}'")  # Debug
    if authenticated_user_id != user_id:
        print(f"Authorization failed: authenticated_user_id={authenticated_user_id}, path_user_id={user_id}")  # Debug
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create tasks for this user"
        )

    # Create new task
    db_task = Task(
        title=task.title,
        description=task.description,
        completed=task.completed,
        user_id=user_id
    )

    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    print(f"DEBUG: Created task {db_task.id} for user_id='{user_id}'")  # Debug
    return db_task

@router.get("/{task_id}", response_model=TaskRead)
def get_task(
    user_id: str,
    task_id: int,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Verify that the requested user_id matches the authenticated user
    authenticated_user_id = current_user.get("sub")
    if authenticated_user_id != user_id:
        print(f"Authorization failed in get_task: authenticated_user_id={authenticated_user_id}, path_user_id={user_id}")  # Debug
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access tasks for this user"
        )

    # Get specific task
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    db_task = session.exec(statement).first()

    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return db_task

@router.put("/{task_id}", response_model=TaskRead)
def update_task(
    user_id: str,
    task_id: int,
    task_update: TaskUpdate,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Verify that the user_id matches the authenticated user
    authenticated_user_id = current_user.get("sub")
    if authenticated_user_id != user_id:
        print(f"Authorization failed in update_task: authenticated_user_id={authenticated_user_id}, path_user_id={user_id}")  # Debug
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update tasks for this user"
        )

    # Get the task to update
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    db_task = session.exec(statement).first()

    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Update the task with provided fields
    update_data = task_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)

    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    user_id: str,
    task_id: int,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Verify that the user_id matches the authenticated user
    authenticated_user_id = current_user.get("sub")
    if authenticated_user_id != user_id:
        print(f"Authorization failed in delete_task: authenticated_user_id={authenticated_user_id}, path_user_id={user_id}")  # Debug
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete tasks for this user"
        )

    # Get the task to delete
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    db_task = session.exec(statement).first()

    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Delete the task
    session.delete(db_task)
    session.commit()
    return

@router.patch("/{task_id}/complete", response_model=TaskRead)
def toggle_task_completion(
    user_id: str,
    task_id: int,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Verify that the user_id matches the authenticated user
    authenticated_user_id = current_user.get("sub")
    if authenticated_user_id != user_id:
        print(f"Authorization failed in toggle_task_completion: authenticated_user_id={authenticated_user_id}, path_user_id={user_id}")  # Debug
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update tasks for this user"
        )

    # Get the task to toggle
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    db_task = session.exec(statement).first()

    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Toggle completion status
    db_task.completed = not db_task.completed
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task