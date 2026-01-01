# Database Schema: Todo Full-Stack Web Application - Phase II

## Overview
The application uses Neon Serverless PostgreSQL for persistent storage. The schema includes tables for users (managed by Better Auth) and tasks.

## Tables

### tasks
**Description**: Stores todo tasks with user associations

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each task |
| user_id | VARCHAR(255) | NOT NULL, FOREIGN KEY | Reference to the user who owns the task |
| title | VARCHAR(200) | NOT NULL, LENGTH(1-200) | Title of the task |
| description | TEXT | NULL, MAX_LENGTH(1000) | Detailed description of the task |
| completed | BOOLEAN | DEFAULT FALSE | Completion status of the task |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | When the task was created |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP, ON UPDATE CURRENT_TIMESTAMP | When the task was last updated |

**Indexes**:
- PRIMARY KEY on (id)
- INDEX on (user_id) for efficient user-based queries

**Foreign Key Constraints**:
- user_id references users.id (managed by Better Auth)

### users (managed by Better Auth)
**Description**: User accounts managed by Better Auth (schema details abstracted)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(255) | PRIMARY KEY | Unique identifier for each user |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email address |
| name | VARCHAR(255) | NULL | User's display name |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | When the user account was created |

## Relationships
- One user (users.id) can have many tasks (tasks.user_id)
- Each task belongs to exactly one user

## Data Integrity Rules
- Tasks cannot exist without a valid user_id
- Task titles must be between 1 and 200 characters
- Task descriptions can be up to 1000 characters
- Task completion defaults to false
- created_at is set when the record is created
- updated_at is updated when the record is modified

## Security Considerations
- User data isolation enforced at application level
- Only authenticated users can access their own tasks
- JWT tokens used to verify user identity