# API Specification: Todo Full-Stack Web Application - Phase II

## REST API Endpoints

### Authentication
All endpoints except login and signup require JWT authentication in the Authorization header.

**Header Format**: `Authorization: Bearer <token>`

### Base URL
`/api/{user_id}/tasks`

### Endpoints

#### GET /api/{user_id}/tasks
**Description**: List all tasks for the authenticated user
**Authentication**: Required
**Response**: 200 OK with array of task objects
**Sample Response**:
```json
[
  {
    "id": 1,
    "user_id": "user123",
    "title": "Sample Task",
    "description": "Sample Description",
    "completed": false,
    "created_at": "2025-12-29T10:00:00Z",
    "updated_at": "2025-12-29T10:00:00Z"
  }
]
```

#### POST /api/{user_id}/tasks
**Description**: Create a new task
**Authentication**: Required
**Request Body**:
```json
{
  "title": "New Task Title",
  "description": "New Task Description"
}
```
**Validation**: Title required (1-200 chars), Description optional (max 1000 chars)
**Response**: 201 Created with created task object

#### GET /api/{user_id}/tasks/{id}
**Description**: Get task details
**Authentication**: Required
**Response**: 200 OK with task object or 404 Not Found

#### PUT /api/{user_id}/tasks/{id}
**Description**: Update a task
**Authentication**: Required
**Request Body**:
```json
{
  "title": "Updated Task Title",
  "description": "Updated Task Description"
}
```
**Response**: 200 OK with updated task object or 404 Not Found

#### DELETE /api/{user_id}/tasks/{id}
**Description**: Delete a task
**Authentication**: Required
**Response**: 204 No Content or 404 Not Found

#### PATCH /api/{user_id}/tasks/{id}/complete
**Description**: Toggle completion status
**Authentication**: Required
**Response**: 200 OK with updated task object or 404 Not Found

### Error Responses

- **401 Unauthorized**: Missing or invalid JWT token
- **404 Not Found**: Task not found or user not found
- **422 Unprocessable Entity**: Invalid request body (validation errors)

### Authentication Endpoints

#### POST /api/auth/signup
**Description**: User registration
**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "User Name"
}
```
**Response**: 201 Created with JWT token

#### POST /api/auth/login
**Description**: User login
**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```
**Response**: 200 OK with JWT token

#### POST /api/auth/logout
**Description**: User logout
**Authentication**: Required
**Response**: 200 OK