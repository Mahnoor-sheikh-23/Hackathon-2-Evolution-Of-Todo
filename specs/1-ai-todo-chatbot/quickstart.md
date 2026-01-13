# Quickstart: AI-Powered Todo Chatbot

## Overview
Quick setup guide for the AI-Powered Todo Chatbot feature. This guide covers the essential steps to get the chatbot functionality running locally.

## Prerequisites
- Python 3.11+ installed
- Node.js 18+ installed
- PostgreSQL database (Neon recommended)
- OpenRouter API key
- Existing Phase II backend running

## Environment Setup

### Backend Environment Variables
Create a `.env` file in the backend directory with the following variables:

```bash
OPENROUTER_API_KEY=your_openrouter_api_key_here
DATABASE_URL=postgresql://username:password@host:port/database_name
BETTER_AUTH_SECRET=your_better_auth_secret_here
```

### Frontend Environment Variables
Create a `.env.local` file in the frontend directory with the following variables:

```bash
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=your_domain_key_here
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
```

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
pip install fastapi uvicorn sqlmodel openai-agents-sdk python-jose[cryptography] passlib[bcrypt] python-multipart httpx
```

### 2. Create Chatbot Directory
```bash
mkdir -p backend/chatbot
```

### 3. Start Backend Server
```bash
cd backend
uvicorn main:app --reload --port 8000
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Frontend Server
```bash
cd frontend
npm run dev
```

## API Usage Examples

### Send a Message to the Chatbot
```bash
curl -X POST http://localhost:8000/api/user123/chat \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Add a task to buy groceries"
  }'
```

### Get Conversation History
```bash
curl -X GET http://localhost:8000/api/user123/conversations \
  -H "Authorization: Bearer your_jwt_token"
```

## Key Endpoints

- `POST /api/{user_id}/chat` - Send message to AI chatbot
- `GET /api/{user_id}/conversations` - Get user's conversation history
- `GET /api/{user_id}/conversations/{id}` - Get messages in specific conversation
- `DELETE /api/{user_id}/conversations/{id}` - Delete specific conversation

## Testing the Feature

1. Ensure the Phase II backend is running on `localhost:8000`
2. Start the frontend on `localhost:3000`
3. Log in to the application
4. Navigate to the chat page or click the floating chat widget
5. Send a message like "Add a task to buy groceries"
6. Verify that the AI responds and the task is created in your task list

## Troubleshooting

- If the AI doesn't respond, check that your OpenRouter API key is valid
- If authentication fails, verify your JWT token is valid and not expired
- If conversations aren't persisting, check that your database connection is working
- If the frontend can't connect to the backend, ensure both servers are running