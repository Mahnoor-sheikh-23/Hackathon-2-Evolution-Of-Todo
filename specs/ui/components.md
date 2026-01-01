# UI Components Specification: Todo Full-Stack Web Application - Phase II

## Overview
The frontend is built with Next.js 16+ using the App Router and Tailwind CSS for styling. Components follow the server-first approach with client components only where interactivity is required.

## Pages

### /login
**Purpose**: User authentication
**Components**:
- LoginForm (Client Component)
  - Email input field
  - Password input field
  - Login button
  - Link to signup page
  - Error message display

### /signup
**Purpose**: User registration
**Components**:
- SignupForm (Client Component)
  - Name input field
  - Email input field
  - Password input field
  - Signup button
  - Link to login page
  - Error message display

### /dashboard
**Purpose**: Main task management interface
**Components**:
- TaskList (Server Component)
  - Fetches and displays user's tasks
  - Shows title, description, and completion status
- TaskForm (Client Component)
  - Form for creating new tasks
  - Title input field
  - Description textarea
  - Submit button
- TaskItem (Client Component)
  - Individual task display
  - Edit/delete buttons
  - Completion toggle checkbox

### /tasks/[id]
**Purpose**: Task detail and editing
**Components**:
- TaskDetail (Server Component)
  - Displays full task details
- TaskEditForm (Client Component)
  - Editable fields for title and description
  - Save/Update button
  - Cancel button
  - Delete button

### Global Components

#### Navbar
**Purpose**: Navigation across the application
**Components**:
- Navigation links to dashboard, etc.
- Logout button
- User information display

## Component Requirements

### Server Components
- Use by default for data fetching and static content
- Handle authentication checks
- Fetch data from API endpoints
- Render static content

### Client Components
- Use only where interactivity is required
- Form handling and submission
- State management for UI interactions
- API calls that require client-side logic

## Styling
- Tailwind CSS utility classes for all styling
- Responsive design for mobile, tablet, and desktop
- Consistent color scheme and typography
- Accessible UI components

## Authentication Integration
- All components must handle JWT tokens from Better Auth
- Redirect to login if not authenticated
- Proper error handling for authentication failures

## API Integration
- All components must properly include JWT tokens in API requests
- Error handling for API failures
- Loading states during API requests
- Success/error feedback to users