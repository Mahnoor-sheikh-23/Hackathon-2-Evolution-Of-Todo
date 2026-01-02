# Quickstart Guide: Todo Full-Stack Web Application - Phase II

## Prerequisites

- Node.js 18+ for frontend
- Python 3.11+ for backend
- PostgreSQL (or Neon Serverless PostgreSQL)
- Better Auth account (or self-hosted instance)

## Environment Setup

1. Clone the repository and navigate to the project directory
2. Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=your_neon_postgresql_connection_string
   BETTER_AUTH_SECRET=your_jwt_secret_key
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
   ```

## Backend Setup

1. Navigate to the `backend/` directory
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install fastapi uvicorn sqlmodel psycopg2-binary python-jose python-multipart
   ```
4. Run the backend server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

## Frontend Setup

1. Navigate to the `frontend/` directory
2. Install dependencies:
   ```bash
   npm install next react react-dom tailwindcss @tailwindcss/forms axios better-auth
   ```
3. Configure Tailwind CSS:
   ```bash
   npx tailwindcss init -p
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Application Flow

1. Access the application at `http://localhost:3000`
2. Register a new account via `/signup` or log in via `/login`
3. Once logged in, you'll be redirected to the `/dashboard`
4. Create, view, update, and delete tasks on the dashboard
5. Edit individual tasks via `/tasks/[id]`

## API Testing

The backend API endpoints are available at `https://hackathon-2-evolution-of-todo-production.up.railway.app/api/{user_id}/tasks`:
- GET `/api/{user_id}/tasks` - List all tasks for user
- POST `/api/{user_id}/tasks` - Create a new task
- GET `/api/{user_id}/tasks/{id}` - Get specific task
- PUT `/api/{user_id}/tasks/{id}` - Update a task
- DELETE `/api/{user_id}/tasks/{id}` - Delete a task
- PATCH `/api/{user_id}/tasks/{id}/complete` - Toggle completion

## Authentication

- All API requests require a valid JWT token in the `Authorization: Bearer <token>` header
- Tokens are obtained during login and stored in the frontend
- The frontend automatically includes the token in API requests
- Invalid or expired tokens will result in 401 Unauthorized responses

## Database Setup

- The application uses Neon Serverless PostgreSQL
- Tables will be created automatically when the application starts
- The `tasks` table has a foreign key relationship to the `users` table (managed by Better Auth)
- Ensure your `DATABASE_URL` environment variable is correctly configured

## Troubleshooting

- If the frontend can't connect to the backend, ensure both servers are running
- If authentication fails, verify your JWT secret is correctly set
- If database connection fails, check your `DATABASE_URL` and ensure PostgreSQL is running
- Check browser console and server logs for specific error messages