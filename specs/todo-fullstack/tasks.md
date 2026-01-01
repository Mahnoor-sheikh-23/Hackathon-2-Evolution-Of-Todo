---
description: "Task list for Todo Full-Stack Web Application - Phase II"
---

# Tasks: Todo Full-Stack Web Application - Phase II

**Input**: Design documents from `/specs/todo-fullstack/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Monorepo**: `frontend/`, `backend/`, `specs/` at repository root
- Paths shown below assume monorepo structure - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create root project directory structure per implementation plan
- [x] T002 [P] Create frontend/ directory with basic Next.js setup
- [x] T003 [P] Create backend/ directory with basic FastAPI setup
- [x] T004 [P] Create .spec-kit/ directory
- [x] T005 [P] Create docker-compose.yml for development environment
- [x] T006 [P] Create root CLAUDE.md with instructions for Claude Code

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 [P] Set up database connection in backend/db.py using Neon PostgreSQL
- [x] T008 [P] Create Task model in backend/models.py using SQLModel
- [x] T009 [P] Create JWT authentication middleware in backend/middleware/auth.py
- [x] T010 [P] Set up Better Auth in frontend for user authentication
- [x] T011 [P] Create API client in frontend/lib/api.ts for backend communication
- [x] T012 [P] Configure Tailwind CSS in frontend

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Multi-User Task Management (Priority: P1) 🎯 MVP

**Goal**: Enable registered users to create, view, update, delete, and mark tasks complete in a web-based todo application with secure authentication

**Independent Test**: Can be fully tested by registering a user, creating tasks, and performing all CRUD operations while ensuring other users cannot access these tasks.

### Implementation for User Story 1

- [x] T013 [P] [US1] Create GET /api/{user_id}/tasks endpoint in backend/routes/tasks.py
- [x] T014 [P] [US1] Create POST /api/{user_id}/tasks endpoint in backend/routes/tasks.py
- [x] T015 [P] [US1] Create GET /api/{user_id}/tasks/{id} endpoint in backend/routes/tasks.py
- [x] T016 [P] [US1] Create PUT /api/{user_id}/tasks/{id} endpoint in backend/routes/tasks.py
- [x] T017 [P] [US1] Create DELETE /api/{user_id}/tasks/{id} endpoint in backend/routes/tasks.py
- [x] T018 [P] [US1] Create PATCH /api/{user_id}/tasks/{id}/complete endpoint in backend/routes/tasks.py
- [x] T019 [US1] Implement JWT validation for all task endpoints in backend/routes/tasks.py
- [x] T020 [US1] Implement user_id validation against JWT payload in backend/routes/tasks.py
- [x] T021 [US1] Create dashboard page in frontend/app/dashboard/page.tsx
- [x] T022 [US1] Create task list component in frontend/components/TaskList.tsx
- [x] T023 [US1] Create task form component in frontend/components/TaskForm.tsx
- [x] T024 [US1] Connect frontend dashboard to backend API endpoints
- [x] T025 [US1] Implement task creation functionality in frontend
- [x] T026 [US1] Implement task listing functionality in frontend
- [x] T027 [US1] Implement task update functionality in frontend
- [x] T028 [US1] Implement task deletion functionality in frontend
- [x] T029 [US1] Implement task completion toggle in frontend

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - User Authentication (Priority: P2)

**Goal**: Allow visitors to register, log in, and log out securely to access their personal todo list

**Independent Test**: Can be tested by registering a new user, logging in, accessing protected resources, and logging out.

### Implementation for User Story 2

- [x] T030 [US2] Create login page in frontend/app/login/page.tsx
- [x] T031 [US2] Create signup page in frontend/app/signup/page.tsx
- [x] T032 [US2] Implement Better Auth configuration in frontend
- [x] T033 [US2] Create login form component in frontend/components/LoginForm.tsx
- [x] T034 [US2] Create signup form component in frontend/components/SignupForm.tsx
- [x] T035 [US2] Implement logout functionality in frontend
- [x] T036 [US2] Create navigation bar with auth links in frontend/components/Navbar.tsx
- [x] T037 [US2] Implement protected route handling in frontend
- [x] T038 [US2] Redirect unauthenticated users from dashboard to login

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - API Security & Data Isolation (Priority: P3)

**Goal**: Ensure tasks are secure and private so that other users cannot access or modify them

**Independent Test**: Can be tested by having multiple users with tasks and verifying they cannot access each other's data.

### Implementation for User Story 3

- [x] T039 [US3] Enhance JWT validation to verify user permissions in backend/routes/tasks.py
- [x] T040 [US3] Implement user ownership validation for task operations in backend/routes/tasks.py
- [x] T041 [US3] Add proper error responses (401, 404) for unauthorized access in backend/routes/tasks.py
- [x] T042 [US3] Create middleware to validate user_id matches JWT payload in backend/middleware/auth.py
- [x] T043 [US3] Implement token expiration handling in frontend
- [x] T044 [US3] Add error handling for 401 responses in frontend API client
- [x] T045 [US3] Implement automatic redirect to login on 401 responses in frontend

**Checkpoint**: At this point, User Stories 1, 2 AND 3 should all work independently

---

## Phase 6: User Story 4 - Frontend Task Management Interface (Priority: P4)

**Goal**: Provide an intuitive web interface to manage tasks efficiently

**Independent Test**: Can be tested by navigating through all frontend pages and performing task operations.

### Implementation for User Story 4

- [x] T046 [US4] Create task detail page in frontend/app/tasks/[id]/page.tsx
- [x] T047 [US4] Create reusable task card component in frontend/components/TaskCard.tsx
- [x] T048 [US4] Implement responsive design for all pages using Tailwind CSS
- [x] T049 [US4] Add loading states to all API interactions in frontend
- [x] T050 [US4] Add error handling and user feedback in frontend
- [x] T051 [US4] Create task edit form in frontend/components/TaskEditForm.tsx
- [x] T052 [US4] Implement client-side validation for task forms in frontend
- [x] T053 [US4] Add search and filter functionality to task list in frontend
- [x] T054 [US4] Implement optimistic updates for task operations in frontend

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T055 [P] Add environment variable configuration for backend
- [x] T056 [P] Add environment variable configuration for frontend
- [x] T057 [P] Implement database migration setup in backend
- [x] T058 [P] Add proper logging to backend API endpoints
- [x] T059 [P] Add input validation to backend API endpoints
- [x] T060 [P] Create README.md with setup and usage instructions
- [x] T061 [P] Add proper error boundaries to frontend
- [x] T062 [P] Final testing of all functionality
- [x] T063 [P] Code cleanup and documentation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Integrates with all previous stories

### Within Each User Story

- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel by different developers
- Different user stories can be worked on in parallel by different team members

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
3. Stories complete and integrate independently

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify functionality after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence