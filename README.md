# Todo Full-Stack Web Application - Evolution of Todo

This is a full-stack Todo application built with Next.js frontend and FastAPI backend, featuring multi-user support, JWT authentication, and PostgreSQL database. The project includes both Phase I (basic functionality) and Phase II (enhanced features).

## Features

- Multi-user support with secure authentication
- Create, read, update, delete, and mark tasks complete
- JWT-based authentication with Better Auth
- Fully responsive web interface with mobile-first design using Next.js and Tailwind CSS
- Hamburger menus for mobile navigation
- Consistent responsive footers across all pages
- Persistent storage with Neon PostgreSQL
- User data isolation (users can only access their own tasks)
- Enhanced UI with theme support (light/dark mode)

## Tech Stack

### Backend
- FastAPI: Modern, fast web framework for Python
- SQLModel: SQL databases with Python types
- Neon PostgreSQL: Serverless PostgreSQL database
- Python-Jose: JWT token handling

### Frontend
- Next.js 16+: React framework with App Router
- Tailwind CSS: Utility-first CSS framework
- TypeScript: Type-safe JavaScript
- Axios: HTTP client for API communication

### Authentication
- Better Auth: Complete authentication solution

## Project Structure

```
evolution-todo-app/
├── backend/                 # FastAPI backend application
│   ├── main.py             # Application entry point
│   ├── models.py           # Database models
│   ├── db.py               # Database connection
│   ├── middleware/         # Authentication middleware
│   └── routes/             # API routes
├── frontend/               # Next.js frontend application
│   ├── app/               # App Router pages
│   ├── components/        # Reusable components
│   ├── lib/               # Utility functions
│   └── public/            # Static assets
├── specs/                  # Specification documents
├── .specify/               # SpecKit Plus configuration
├── docker-compose.yml      # Docker configuration
└── README.md
```

## Setup

### Prerequisites

- Node.js 18+ for frontend
- Python 3.11+ for backend
- PostgreSQL (or Neon Serverless PostgreSQL)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL=your_neon_postgresql_connection_string
BETTER_AUTH_SECRET=your_jwt_secret_key
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### Backend Setup

1. Navigate to the `backend/` directory
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the backend server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### Frontend Setup

1. Navigate to the `frontend/` directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Running Both Phases

This project represents the evolution of a Todo application through two phases:

### Phase I - Basic Todo App
- Core functionality: Create, read, update, delete tasks
- User authentication and authorization
- Basic cmd 

### Phase II - Enhanced Todo App (Current State)
- Fully responsive design with mobile-first approach
- Hamburger menus for mobile navigation
- Consistent responsive footers across all pages
- Enhanced UI with theme support (light/dark mode)
- Improved user experience with better animations and transitions
- Task titles are now clickable to navigate to task details

Both phases are implemented in the current codebase. To run the complete application (Phase II), follow the setup instructions above.

## Phase Evolution Notes

The application has evolved from a basic todo app to a fully responsive, feature-rich application:
- Added responsive navigation with hamburger menus for mobile devices
- Implemented consistent footers across all pages
- Enhanced UI with theme support and smooth animations
- Improved accessibility and user experience
- Added clickable task items for easier navigation

## API Endpoints

### Authentication (handled by Better Auth)
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout

### Task Management
- `GET /api/{user_id}/tasks` - List all tasks for user
- `POST /api/{user_id}/tasks` - Create a new task
- `GET /api/{user_id}/tasks/{id}` - Get specific task
- `PUT /api/{user_id}/tasks/{id}` - Update a task
- `DELETE /api/{user_id}/tasks/{id}` - Delete a task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle completion

All endpoints require a valid JWT token in the `Authorization: Bearer <token>` header.

## Security

- JWT-based authentication for all API requests
- User data isolation - users can only access their own tasks
- Input validation and sanitization
- Secure token handling and expiration

## Development

This project follows the Spec-Driven Development methodology with Claude Code and Spec-Kit Plus.

## License

This project is part of the Evolution of Todo hackathon and is governed by the project's terms.