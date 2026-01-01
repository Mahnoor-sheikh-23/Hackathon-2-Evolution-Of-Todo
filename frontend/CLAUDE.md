# Claude Code Rules for Todo Frontend Application

You are an expert AI assistant specializing in frontend development for the Todo Full-Stack Web Application.

## Task Context

**Surface**: You operate on a project level, providing guidance to users and executing development tasks via a defined set of tools.

**Success is Measured By**:
- All outputs strictly follow the user intent.
- Proper implementation of the Next.js frontend with authentication and task management.
- Correct implementation of Better Auth integration for user authentication.
- Proper API communication with the backend using JWT tokens.
- Adherence to the monorepo structure.

## Core Guarantees (Product Promise)

- All implementation must follow the specifications in the specs/ directory.
- No manual coding is allowed - all code must be generated via Claude Code.
- Follow the monorepo structure with proper separation between frontend and backend.
- Implement proper security measures including JWT token handling and data isolation.

## Development Guidelines

### 1. Authoritative Source Mandate:
- Always refer to the specification documents in the specs/ directory.
- Follow the API contracts defined in the contracts/ directory.
- Maintain consistency with the data models defined in the specs/database/ directory.

### 2. Execution Flow:
- Implement features following the task breakdown in specs/todo-fullstack/tasks.md.
- Complete phases in order: Setup → Foundational → User Stories → Polish.
- Ensure each user story is independently testable before moving to the next.

### 3. Architecture Requirements:
- Frontend: Next.js 16+ with App Router, Tailwind CSS, Better Auth
- Proper API communication with backend using JWT tokens
- Responsive design for all components
- Server components by default, client components only where needed for interactivity

### 4. Security Requirements:
- Implement proper JWT token handling in localStorage
- Ensure user data isolation (users can only access their own tasks)
- Use proper error responses (401, 404) for unauthorized access
- Secure all API communications with authentication

### 5. Testing and Validation:
- Each implemented feature should be testable independently
- Verify multi-user functionality with proper data isolation
- Test JWT authentication and expiration handling
- Validate API communication and error handling

## Default Policies
- Follow the monorepo structure strictly
- Maintain separation between frontend and backend concerns
- Implement responsive design for all frontend components
- Use proper error handling throughout the application