# Data Model: AI-Powered Todo Chatbot

## Overview
Data model for the AI-Powered Todo Chatbot feature, defining the structure of conversations and messages stored in the database.

## Entity: Conversation
Represents a single chat session with the AI assistant

**Fields**:
- `id` (Integer, Primary Key, Auto-increment)
- `user_id` (String, Foreign Key to users table, not null)
- `created_at` (DateTime, not null, default: current timestamp)
- `updated_at` (DateTime, not null, default: current timestamp)

**Relationships**:
- One-to-many with Message (one conversation has many messages)
- Many-to-one with User (one user has many conversations)

**Validation Rules**:
- `user_id` must reference an existing user
- `created_at` must be in the past or present
- `updated_at` must be >= `created_at`

## Entity: Message
Represents an individual message in a conversation

**Fields**:
- `id` (Integer, Primary Key, Auto-increment)
- `conversation_id` (Integer, Foreign Key to conversations table, not null)
- `user_id` (String, Foreign Key to users table, not null)
- `role` (String, not null, values: "user" or "assistant")
- `content` (Text, not null)
- `created_at` (DateTime, not null, default: current timestamp)

**Relationships**:
- Many-to-one with Conversation (many messages belong to one conversation)
- Many-to-one with User (many messages belong to one user)

**Validation Rules**:
- `conversation_id` must reference an existing conversation
- `user_id` must reference an existing user
- `role` must be either "user" or "assistant"
- `content` must not be empty
- `user_id` in message must match the user who owns the conversation

## Entity: Task (Existing from Phase II)
Represents a todo item that can be managed through the chatbot

**Fields** (from Phase II constitution):
- `id` (Integer, Primary Key, Auto-increment)
- `user_id` (String, Foreign Key to users table, not null)
- `title` (String, not null)
- `description` (Text, nullable)
- `completed` (Boolean, not null, default: false)
- `created_at` (DateTime, not null, default: current timestamp)
- `updated_at` (DateTime, not null, default: current timestamp)

**Relationships**:
- Many-to-one with User (many tasks belong to one user)

**Validation Rules**:
- `user_id` must reference an existing user
- `title` must not be empty
- Each task belongs to exactly one user
- Users can only access or modify their own tasks

## Database Relationships

```
User (1) <---> (Many) Conversation (1) <---> (Many) Message
User (1) <---> (Many) Task
```

## Constraints and Indexes

**Indexes**:
- Conversation: index on `user_id` for efficient user conversation lookup
- Message: index on `conversation_id` for efficient conversation message retrieval
- Message: index on `user_id` for efficient user message lookup
- Task: index on `user_id` for efficient user task lookup

**Foreign Key Constraints**:
- Message.conversation_id references Conversation.id
- Message.user_id references User.id
- Conversation.user_id references User.id
- Task.user_id references User.id

**Data Isolation**:
- All queries must include user_id filter to ensure data isolation
- Users can only access their own conversations, messages, and tasks